'use client';

import { useState, useMemo } from 'react';
import type { Term, Card, CardType } from '@/lib/definitions';
import { GameCard } from '@/components/game/Card';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { generateCardName } from '@/ai/flows/generate-card-name';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, Dices, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DeckBuilderClientProps {
  ownedTerms: Term[];
}

// Function to calculate final card details
const createCardFromTerms = (terms: Term[], name: string, type: CardType): Card | null => {
  if (terms.length === 0) return null;

  const baseTerms = terms.filter(t => t.type === '基础');
  const specialTerms = terms.filter(t => t.type === '特殊');
  const conditionalTerms = terms.filter(t => t.type === '限定');
  
  if (baseTerms.length === 0 && specialTerms.length === 0) return null;

  let totalCost = 0;
  let description = '';
  let attack = 0;
  let health = 0;

  const nonConditionalTerms = [...baseTerms, ...specialTerms];

  nonConditionalTerms.forEach(term => {
    totalCost += Number(term.cost);
    if (type === '法术牌') {
      description += term.description.spell + ' ';
    } else {
      description += term.description.creature + ' ';
      if (term.description.creature.includes('Summons')) {
        const match = term.description.creature.match(/(\d+)\/(\d+)/);
        if (match) {
          attack += parseInt(match[1], 10);
          health += parseInt(match[2], 10);
        }
      }
    }
  });

  conditionalTerms.forEach(term => {
    const modifier = term.cost.toString();
    if (modifier.startsWith('*')) {
      totalCost *= parseFloat(modifier.substring(1));
    } else if (modifier.startsWith('/')) {
      totalCost /= parseFloat(modifier.substring(1));
    } else {
      totalCost += parseFloat(modifier);
    }
    description += (type === '法术牌' ? term.description.spell : term.description.creature) + ' ';
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

  const previewCard = useMemo(() => createCardFromTerms(craftingTerms, cardName, cardType), [craftingTerms, cardName, cardType]);

  const addTermToCrafting = (term: Term) => {
    setCraftingTerms(prev => [...prev, term]);
  };

  const removeTermFromCrafting = (index: number) => {
    setCraftingTerms(prev => prev.filter((_, i) => i !== index));
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
      setDeck(prev => [...prev, previewCard]);
      clearCrafting();
      toast({ title: '卡牌已添加!', description: `"${previewCard.name}" 已添加到您的牌组。` });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Terms List */}
      <UICard>
        <CardHeader>
          <CardTitle className="font-headline">可用词条</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] lg:h-[70vh]">
            <div className="space-y-4 pr-4">
              {ownedTerms.map(term => (
                <div key={term.id} className="p-3 bg-secondary rounded-lg flex items-center justify-between">
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

      {/* Crafting Area and Preview */}
      <div className="space-y-8">
        <UICard>
          <CardHeader>
            <CardTitle className="font-headline">制作区</CardTitle>
          </CardHeader>
          <CardContent className="min-h-48">
            {craftingTerms.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">添加词条以开始制作。</p>
            ) : (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 pb-4">
                {craftingTerms.map((term, index) => (
                    <Badge key={index} variant="secondary" className="text-lg p-2">
                    {term.name}
                    <button onClick={() => removeTermFromCrafting(index)} className="ml-2 text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </Badge>
                ))}
                </div>
              </ScrollArea>
            )}
             {craftingTerms.length > 0 && <Button variant="destructive" size="sm" onClick={clearCrafting} className="mt-4">清空</Button>}
          </CardContent>
        </UICard>
        
        <div className="flex justify-center">
            {previewCard && <GameCard card={previewCard} />}
        </div>

        {previewCard && (
          <UICard>
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
              <Button size="lg" className="w-full" onClick={addCardToDeck}>添加到牌组</Button>
            </CardContent>
          </UICard>
        )}
      </div>

      {/* Deck List */}
      <UICard>
        <CardHeader>
          <CardTitle className="font-headline">当前牌组 ({deck.length}/30)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] lg:h-[70vh]">
            <div className="space-y-2 pr-4">
              {deck.map((card, index) => (
                <div key={index} className="flex justify-between items-center bg-secondary p-2 rounded-lg">
                  <span className="truncate pr-2">{card.name}</span>
                  <Badge variant="outline">{card.finalCost}</Badge>
                </div>
              ))}
              {deck.length === 0 && <p className="text-muted-foreground text-center py-10">你的牌组是空的。</p>}
            </div>
          </ScrollArea>
        </CardContent>
      </UICard>
    </div>
  );
}
