
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { Term, Card, CardType } from '@/lib/definitions';
import { GameCard } from '@/components/game/Card';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { generateCardName } from '@/ai/flows/generate-card-name';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, Trash2, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface LimiterGroup {
  limiter: Term;
  children: Term[];
}

type CraftingItem = Term | LimiterGroup;

const createCardFromTerms = (terms: CraftingItem[], name: string, type: CardType): Card | null => {
    if (terms.length === 0) return null;

    let totalCost = 0;
    const descriptionParts: string[] = [];
    let attack = 0;
    let health = 0;
    
    const mainTerms = terms.filter(t => !('limiter' in t)) as Term[];
    const limiterGroups = terms.filter(t => 'limiter' in t) as LimiterGroup[];

    // --- Process Main Terms ---
    const mainTermCounts: { [id: string]: number } = {};
    mainTerms.forEach(term => {
        mainTermCounts[term.id] = (mainTermCounts[term.id] || 0) + 1;
    });

    Object.keys(mainTermCounts).forEach(termId => {
        const term = mainTerms.find(t => t.id === termId);
        if (!term) return;

        const count = mainTermCounts[termId];
        const descTemplate = type === '法术牌' ? term.description.spell : term.description.creature;
        
        if (descTemplate) {
            const finalDesc = descTemplate.replace(/(\d+)[xX]/g, (match, num) => {
                return (parseInt(num) * count).toString();
            }).replace(/[xX]/g, count.toString());
             if (finalDesc.trim()) descriptionParts.push(finalDesc);
        }

        if (type === '造物牌') {
            const attackDesc = term.description.creature?.match(/获得(\d*)[xX]点攻击力/);
            if (attackDesc) {
                attack += (parseInt(attackDesc[1] || '1') * count);
            }
            const healthDesc = term.description.creature?.match(/获得(\d*)[xX]点生命值/);
             if (healthDesc) {
                health += (parseInt(healthDesc[1] || '1') * count);
            }
        }
    });

    // --- Process Limiter Groups ---
    limiterGroups.forEach(group => {
        const limiter = group.limiter;
        const children = group.children;
        let limiterDesc = type === '法术牌' ? limiter.description.spell : limiter.description.creature;
        limiterDesc = limiterDesc.replace(/\[触发特定效果\]/g, '??'); // Placeholder
        
        const childTermCounts: { [id: string]: number } = {};
        children.forEach(term => {
            childTermCounts[term.id] = (childTermCounts[term.id] || 0) + 1;
        });

        const childEffectDescriptions: string[] = [];
        Object.keys(childTermCounts).forEach(termId => {
            const term = children.find(t => t.id === termId);
            if (!term) return;

            const count = childTermCounts[termId];
            const descTemplate = type === '法术牌' ? term.description.spell : term.description.creature;

             if (descTemplate) {
                const finalDesc = descTemplate.replace(/(\d+)[xX]/g, (match, num) => {
                    return (parseInt(num) * count).toString();
                }).replace(/[xX]/g, count.toString());

                if (finalDesc.trim()) {
                    childEffectDescriptions.push(finalDesc);
                }
            }
        });
        
        const combinedChildEffects = childEffectDescriptions.join(' ');
        const finalLimiterDesc = `[${limiter.name}]: ${limiterDesc.replace('??', combinedChildEffects)}`;
        descriptionParts.push(finalLimiterDesc);
    });

    // --- Naive Cost Calculation (Placeholder) ---
    terms.forEach(item => {
        if ('limiter' in item) {
            // Very naive cost logic for now
            item.children.forEach(child => { totalCost += (typeof child.cost === 'number' ? child.cost : 1); });
        } else {
            totalCost += (typeof item.cost === 'number' ? item.cost : 1);
        }
    });
    const finalCost = Math.max(1, Math.ceil(totalCost));

    return {
        id: `card-${Date.now()}`,
        name,
        // @ts-ignore - terms structure is complex
        terms,
        finalCost,
        type,
        description: descriptionParts.join(' ').trim(),
        attack,
        health,
        artId: 'card-art-1',
    };
};


export function DeckBuilderClient({ ownedTerms }: { ownedTerms: Term[] }) {
  const [mainTerms, setMainTerms] = useState<CraftingItem[]>([]);
  const [limiterTerms, setLimiterTerms] = useState<Term[]>([]);
  const [craftingMode, setCraftingMode] = useState<'main' | { limiter: Term }>('main');

  const [cardName, setCardName] = useState('新卡牌');
  const [cardType, setCardType] = useState<CardType>('法术牌');
  const [deck, setDeck] = useState<Card[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const enemyId = searchParams.get('enemyId');
  const DECK_MAX_COST = 500; 

  const termsInCurrentCraftingArea = useMemo(() => {
    return craftingMode === 'main' ? mainTerms : limiterTerms;
  }, [mainTerms, limiterTerms, craftingMode]);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      };
      container.addEventListener('wheel', handleWheel);
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const previewCard = useMemo(() => {
      let allTerms: CraftingItem[] = [...mainTerms];
      if (craftingMode !== 'main' && limiterTerms.length > 0) {
        allTerms.push({ limiter: craftingMode.limiter, children: limiterTerms });
      }
      return createCardFromTerms(allTerms, cardName, cardType);
  }, [mainTerms, limiterTerms, craftingMode, cardName, cardType]);
  
  
  const deckTotalCost = useMemo(() => {
    return deck.reduce((total, card) => total + card.finalCost, 0);
  }, [deck]);

  const addTermToCrafting = (term: Term) => {
    // Entering limiter edit mode
    if (term.type === '限定') {
        const isAlreadyInMain = mainTerms.some(t => 'limiter' in t && t.limiter.id === term.id);
        if (isAlreadyInMain) {
            toast({
                title: '无法添加限定词',
                description: '每张卡牌只能有一个相同的限定词。',
                variant: 'destructive',
            });
            return;
        }
        setCraftingMode({ limiter: term });
        return;
    }

    const currentTerms = craftingMode === 'main' ? mainTerms.filter((t): t is Term => !('limiter' in t)) : limiterTerms;
    const isNumericTerm = term.name.includes('X');
    
    if (!isNumericTerm) {
        const isAlreadyInCrafting = currentTerms.some(t => t.id === term.id);
        if (isAlreadyInCrafting) {
            toast({
                title: '无法添加词条',
                description: `“${term.name}”是一个唯一的词条，不能重复添加。`,
                variant: 'destructive',
            });
            return;
        }
    }


    if (craftingMode === 'main') {
        setMainTerms(prev => [...prev, term]);
    } else {
        setLimiterTerms(prev => [...prev, term]);
    }
  };

  const removeTermFromCrafting = (termId: string, index: number) => {
    if (craftingMode === 'main') {
        // If it's a limiter group, remove the whole group
        setMainTerms(prev => prev.filter((item, i) => {
            if (i !== index) return true;
            if ('limiter' in item) return item.limiter.id !== termId;
            return item.id !== termId;
        }));
    } else {
        setLimiterTerms(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const clearCrafting = () => {
    if (craftingMode === 'main') {
      setMainTerms([]);
    } else {
      setLimiterTerms([]);
    }
    // Keep card name for consistency, user can reset it
  }

  const completeLimiterEditing = () => {
    if (craftingMode === 'main' || limiterTerms.length === 0) {
      // If no terms added, just exit without adding group
      setLimiterTerms([]);
      setCraftingMode('main');
      return;
    };

    const newGroup: LimiterGroup = {
        limiter: craftingMode.limiter,
        children: limiterTerms,
    };
    
    setMainTerms(prev => [...prev, newGroup]);
    setLimiterTerms([]);
    setCraftingMode('main');
  }

  const handleGenerateName = async () => {
    const termsForAI = mainTerms.flatMap(t => ('limiter' in t) ? [t.limiter, ...t.children] : [t]);
    if (termsForAI.length === 0) {
      toast({ title: "无法生成名称", description: "请先将一些词条添加到制作区。", variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateCardName({ terms: termsForAI.map(t => ({...t, cost: String(t.cost)})) });
      setCardName(result.cardName);
    } catch (error) {
      console.error('AI name generation failed:', error);
      toast({ title: "AI 错误", description: "生成名称失败。请重试。", variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const addCardToDeck = () => {
    if (craftingMode !== 'main') {
        toast({ title: '请先完成限定词编辑', description: '点击“返回主制作区”以完成当前限定词的构筑。', variant: 'destructive' });
        return;
    }

    const finalPreviewCard = createCardFromTerms(mainTerms, cardName, cardType);

    if (finalPreviewCard) {
      if (deckTotalCost + finalPreviewCard.finalCost > DECK_MAX_COST) {
        toast({ title: '已达消耗上限', description: `无法添加此卡牌，它会使牌组总消耗超过 ${DECK_MAX_COST}。`, variant: 'destructive'});
        return;
      }
      setDeck(prev => [...prev, finalPreviewCard]);
      setMainTerms([]);
      setLimiterTerms([]);
      setCardName("新卡牌");
      toast({ title: '卡牌已添加!', description: `"${finalPreviewCard.name}" 已添加到您的牌组。` });
    }
  };

  const handleSaveDeck = () => {
    if (deck.length === 0) {
        toast({ title: '无法保存', description: '你的牌组是空的。', variant: 'destructive' });
        return;
    }
    toast({ title: '牌组已保存！', description: '（此功能为占位符）' });
  }
  
  const groupedCraftingTerms = useMemo(() => {
    const termsToGroup: CraftingItem[] = [...termsInCurrentCraftingArea];

    const termMap: { [id: string]: { item: CraftingItem; count: number } } = {};

    termsToGroup.forEach(item => {
        if ('limiter' in item) {
             const key = item.limiter.id;
             if (!termMap[key]) {
                termMap[key] = { item: item, count: 1 };
             }
        } else {
            const key = item.id;
            const isNumeric = item.name.includes('X');
            if (isNumeric) {
                if (!termMap[key]) {
                    termMap[key] = { item: item, count: 0 };
                }
                termMap[key].count++;
            } else {
                 if (!termMap[key]) {
                    termMap[key] = { item: item, count: 1 };
                 }
            }
        }
    });

    return Object.values(termMap);
  }, [termsInCurrentCraftingArea]);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full pb-20">
        <UICard className="bg-card/50">
          <CardHeader>
            <CardTitle className="font-headline">可用词条</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-25rem)]">
              <div className="space-y-4 pr-4">
                {ownedTerms.map(term => (
                  <div key={term.id} className="p-3 bg-secondary/70 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{term.name} <span className="text-xs font-normal text-muted-foreground">({term.type})</span></h3>
                      <p className="text-xs text-muted-foreground mt-1">法术: {term.description.spell}</p>
                      <p className="text-xs text-muted-foreground">造物: {term.description.creature}</p>
                    </div>
                    <Button size="sm" onClick={() => addTermToCrafting(term)}>添加</Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </UICard>

        <div className="lg:col-span-2">
          <Tabs defaultValue="creator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="creator">卡牌创造</TabsTrigger>
              <TabsTrigger value="deck">当前牌组 ({deck.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="creator" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <UICard className="bg-card/50">
                    <CardHeader>
                      <div className="flex items-center gap-2 justify-between">
                        <CardTitle className="font-headline flex items-center gap-2">
                          {craftingMode !== 'main' && (
                             <Button variant="outline" size="sm" onClick={completeLimiterEditing} className="h-auto px-2 py-1">
                                <ArrowLeft className="w-4 h-4 mr-1"/> 完成
                             </Button>
                          )}
                          <span>{craftingMode === 'main' ? '主制作区' : `编辑限定词: ${craftingMode.limiter.name}`}</span>
                        </CardTitle>
                        {termsInCurrentCraftingArea.length > 0 && <Button variant="destructive" size="sm" onClick={clearCrafting} className="h-auto px-2 py-1">清空</Button>}
                      </div>
                    </CardHeader>
                    <CardContent className="min-h-[12rem]">
                      {termsInCurrentCraftingArea.length === 0 ? (
                          <p className="text-muted-foreground text-center py-10">
                            {craftingMode === 'main' ? '从左侧添加词条以开始制作。' : `为“${craftingMode.limiter.name}”添加词条。`}
                          </p>
                      ) : (
                        <div ref={scrollContainerRef} className="overflow-x-auto whitespace-nowrap pb-4">
                          <div className="flex w-max space-x-4">
                          {groupedCraftingTerms.map(({ item, count }, index) => {
                            if ('limiter' in item) { // This is a Limiter Group in the main area
                                return (
                                     <div key={item.limiter.id} className="relative inline-block p-2 border border-dashed rounded-lg bg-black/20">
                                        <Badge variant="default" className="text-md p-2">
                                            {item.limiter.name}
                                        </Badge>
                                        <div className="flex gap-2 mt-2 pl-2">
                                            {item.children.map(child => (
                                                <Badge key={child.id} variant="secondary">{child.name}</Badge>
                                            ))}
                                        </div>
                                         <button onClick={() => removeTermFromCrafting(item.limiter.id, mainTerms.findIndex(t => 'limiter' in t && t.limiter.id === item.limiter.id))} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/80">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                     </div>
                                )
                            }
                            const term = item as Term;
                            const isNumeric = term.name.includes('X');
                            
                            // Find the original index to pass to remove function
                            const originalIndex = termsInCurrentCraftingArea.findIndex(t => 'id' in t && t.id === term.id);
                            
                            return (
                              <div key={term.id + index} className="relative inline-block">
                                  <Badge variant="secondary" className="text-lg p-3 pr-8">
                                      {term.name}
                                      {isNumeric && count > 1 && <span className="font-bold text-sm ml-1">x{count}</span>}
                                  </Badge>
                                  <button onClick={() => removeTermFromCrafting(term.id, originalIndex)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/80">
                                      <Trash2 className="w-3 h-3" />
                                  </button>
                              </div>
                            )
                          })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </UICard>

                  {(craftingMode === 'main' && mainTerms.length > 0) && (
                    <UICard className="bg-card/50">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-2">
                              <Input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="输入卡牌名称" />
                              <Button onClick={handleGenerateName} disabled={isGenerating}>
                                  {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                  <span className="ml-2 hidden sm:inline">AI取名</span>
                              </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setCardType('法术牌')} variant={cardType === '法术牌' ? 'default' : 'secondary'} className="w-full">法术</Button>
                          <Button onClick={() => setCardType('造物牌')} variant={cardType === '造物牌' ? 'default' : 'secondary'} className="w-full">生物</Button>
                        </div>
                        <Button size="lg" className="w-full" onClick={addCardToDeck} disabled={craftingMode !== 'main'}>
                          添加到牌组
                        </Button>
                      </CardContent>
                    </UICard>
                  )}
                </div>
                
                <div className="flex justify-center items-start">
                    {previewCard ? <GameCard card={previewCard} /> :
                      <div className="w-64 h-96 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-card/30">
                          <p className="text-muted-foreground">卡牌预览</p>
                      </div>
                    }
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deck" className="mt-4">
              <UICard className="bg-card/50">
                <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="font-headline">当前牌组 ({deck.length})</CardTitle>
                      <div>
                        <span className="text-sm text-muted-foreground">总消耗: </span>
                        <span className="font-bold">{deckTotalCost} / {DECK_MAX_COST}</span>
                      </div>
                    </div>
                    <Progress value={(deckTotalCost / DECK_MAX_COST) * 100} className="mt-2 h-2" />
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-33rem)]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 pr-4">
                      {deck.map((card, index) => (
                        <div key={index} className="relative group/deckcard">
                          <GameCard card={card} />
                           <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover/deckcard:opacity-100 transition-opacity"
                              onClick={() => setDeck(d => d.filter((_, i) => i !== index))}
                          >
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {deck.length === 0 && 
                        <div className="col-span-full text-muted-foreground text-center py-10">
                          <p>你的牌组是空的。</p>
                        </div>
                      }
                    </div>
                  </ScrollArea>
                </CardContent>
              </UICard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 border-t border-border backdrop-blur-sm flex justify-between items-center">
            <Button variant="outline" asChild>
                <Link href={enemyId ? `/deck-selection?enemyId=${enemyId}` : '/worlds'}>
                    <ArrowLeft className="mr-2" />
                    返回
                </Link>
            </Button>
            <Button size="lg" className="font-headline text-lg" onClick={handleSaveDeck}>
                <Save className="mr-2"/>
                保存牌组
            </Button>
        </div>
    </>
  );
}

    
