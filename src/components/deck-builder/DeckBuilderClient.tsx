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
import { Wand2, Loader2, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface DeckBuilderClientProps {
  ownedTerms: Term[];
}

const DECK_MAX_COST = 100;

// Function to calculate final card details
const createCardFromTerms = (terms: Term[], name: string, type: CardType): Card | null => {
    if (terms.length === 0) return null;

    const termCounts: { [id: string]: { term: Term; count: number } } = {};
    terms.forEach(term => {
        if (!termCounts[term.id]) {
            termCounts[term.id] = { term, count: 0 };
        }
        termCounts[term.id].count++;
    });

    const baseTerms = Object.values(termCounts).filter(tc => tc.term.type === '基础');
    const specialTerms = Object.values(termCounts).filter(tc => tc.term.type === '特殊');
    const conditionalTerms = Object.values(termCounts).filter(tc => tc.term.type === '限定');
    
    if (baseTerms.length === 0 && specialTerms.length === 0) return null;

    let totalCost = 0;
    let description = '';
    let attack = 0;
    let health = 0;

    const processDescription = (desc: string, count: number) => {
        return desc.replace(/(\d+)/g, (match) => (parseInt(match) * count).toString()) + ' ';
    };
    
    const allTermsForDescription = [...baseTerms, ...specialTerms, ...conditionalTerms];

    allTermsForDescription.forEach(({term, count}) => {
        const desc = type === '法术牌' ? term.description.spell : term.description.creature;
        if (desc) {
             description += processDescription(desc, count);
        }
    })

    const nonConditionalTerms = [...baseTerms, ...specialTerms];

    nonConditionalTerms.forEach(({ term, count }) => {
        totalCost += Number(term.cost) * count;
        
        if (type === '造物牌' && term.description.creature) {
            const creatureDesc = term.description.creature.repeat(count);
            const attackMatches = creatureDesc.matchAll(/(\d+)\s*点攻击力/g);
            for (const match of attackMatches) {
                attack += parseInt(match[1], 10);
            }
            const healthMatches = creatureDesc.matchAll(/(\d+)\s*点生命值/g);
             for (const match of healthMatches) {
                health += parseInt(match[1], 10);
            }
        }
    });

    conditionalTerms.forEach(({ term, count }) => {
        for (let i = 0; i < count; i++) {
            const modifier = term.cost.toString();
            if (modifier.startsWith('*')) {
                totalCost *= parseFloat(modifier.substring(1));
            } else if (modifier.startsWith('/')) {
                totalCost /= parseFloat(modifier.substring(1));
            } else {
                totalCost += parseFloat(modifier);
            }
        }
    });

    const finalCost = Math.max(1, Math.ceil(totalCost));

    return {
        id: `card-${Date.now()}`,
        name,
        terms,
        finalCost,
        type,
        description: description.trim(),
        attack,
        health,
        artId: terms[0]?.artId || 'card-art-1',
    };
};

export function DeckBuilderClient({ ownedTerms }: DeckBuilderClientProps) {
  const [craftingTerms, setCraftingTerms] = useState<Term[]>([]);
  const [cardName, setCardName] = useState('新卡牌');
  const [cardType, setCardType] = useState<CardType>('法术牌');
  const [deck, setDeck] = useState<Card[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const previewCard = useMemo(() => createCardFromTerms(craftingTerms, cardName, cardType), [craftingTerms, cardName, cardType]);
  const deckTotalCost = useMemo(() => deck.reduce((sum, card) => sum + card.finalCost, 0), [deck]);

  const addTermToCrafting = (term: Term) => {
    setCraftingTerms(prev => [...prev, term]);
  };

  const removeTermFromCrafting = (termId: string) => {
    setCraftingTerms(prev => {
        const index = prev.findIndex(t => t.id === termId);
        if (index === -1) return prev;
        const newTerms = [...prev];
        newTerms.splice(index, 1);
        return newTerms;
    });
  };
  
  const clearCrafting = () => {
    setCraftingTerms([]);
    setCardName("新卡牌");
  }

  const handleGenerateName = async () => {
    if (craftingTerms.length === 0) {
      toast({ title: "无法生成名称", description: "请先将一些词条添加到制作区。", variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateCardName({ terms: craftingTerms });
      setCardName(result.cardName);
    } catch (error) {
      console.error('AI name generation failed:', error);
      toast({ title: "AI 错误", description: "生成名称失败。请重试。", variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const addCardToDeck = () => {
    if (previewCard) {
      if (deckTotalCost + previewCard.finalCost > DECK_MAX_COST) {
        toast({ title: '牌组法力已达上限', description: `添加此卡牌将超过 ${DECK_MAX_COST} 的法力总值限制。`, variant: 'destructive' });
        return;
      }
      setDeck(prev => [...prev, previewCard]);
      clearCrafting();
      toast({ title: '卡牌已添加!', description: `"${previewCard.name}" 已添加到您的牌组。` });
    }
  };

  const handleSaveDeck = () => {
    // In a real app, this would open a dialog to name the deck and save it to the backend.
    if (deck.length === 0) {
        toast({ title: '无法保存', description: '你的牌组是空的。', variant: 'destructive' });
        return;
    }
    toast({ title: '牌组已保存！', description: '（此功能为占位符）' });
  }

  const groupedCraftingTerms = useMemo(() => {
    const counts: { [id: string]: { term: Term; count: number } } = {};
    craftingTerms.forEach(term => {
        if (!counts[term.id]) {
            counts[term.id] = { term, count: 0 };
        }
        counts[term.id].count++;
    });
    return Object.values(counts);
  }, [craftingTerms]);

  const isDeckFull = deckTotalCost >= DECK_MAX_COST;


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full pb-20">
        {/* Terms List */}
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

        {/* Crafting and Deck Area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="creator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="creator">卡牌创造</TabsTrigger>
              <TabsTrigger value="deck">当前牌组 ({deck.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="creator" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Crafting Area */}
                <div className="space-y-8">
                  <UICard className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="font-headline">制作区</CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-48">
                      {craftingTerms.length === 0 ? (
                          <p className="text-muted-foreground text-center py-10">添加词条以开始制作。</p>
                      ) : (
                        <div ref={scrollContainerRef} className="overflow-x-auto whitespace-nowrap pb-4">
                          <div className="flex w-max space-x-4">
                          {groupedCraftingTerms.map(({ term, count }) => (
                              <div key={term.id} className="relative inline-block">
                                  <Badge variant="secondary" className="text-lg p-3 pr-8">
                                      {term.name}
                                      {count > 1 && <span className="font-bold text-sm ml-1">x{count}</span>}
                                  </Badge>
                                  <button onClick={() => removeTermFromCrafting(term.id)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/80">
                                      <Trash2 className="w-3 h-3" />
                                  </button>
                              </div>
                          ))}
                          </div>
                        </div>
                      )}
                      {craftingTerms.length > 0 && <Button variant="destructive" size="sm" onClick={clearCrafting} className="mt-4">清空</Button>}
                    </CardContent>
                  </UICard>

                  {previewCard && (
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
                        <Button size="lg" className="w-full" onClick={addCardToDeck} disabled={isDeckFull || (previewCard && deckTotalCost + previewCard.finalCost > DECK_MAX_COST)}>
                          添加到牌组 {isDeckFull && "(法力已满)"}
                        </Button>
                      </CardContent>
                    </UICard>
                  )}
                </div>
                
                {/* Preview */}
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
                      <div className="text-right">
                          <p className="text-sm font-bold text-primary">{deckTotalCost} / {DECK_MAX_COST}</p>
                          <p className="text-xs text-muted-foreground">总法力消耗</p>
                      </div>
                    </div>
                    <Progress value={(deckTotalCost / DECK_MAX_COST) * 100} className="mt-2" />
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
                <Link href="/deck-selection">
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
