import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function ConceptSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [conceptualResults, setConceptualResults] = useState([]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setConceptualResults([]);
      return;
    }

    setSearching(true);

    // Keyword search
    const courses = await base44.entities.Course.list();
    const keywordMatches = courses.filter(c =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setResults(keywordMatches);

    // Conceptual/Semantic search using AI
    try {
      const conceptPrompt = `
        User is searching for: "${searchQuery}"
        
        Map this to Torah/Chassidut concepts and return related topics.
        For example:
        - "sadness" → Simcha, Joy, Depression, Atzvut
        - "meditation" → Hitbodedut, Prayer, Kavana
        - "struggle" → Yetzer Hara, Teshuva, Spiritual Battle
        
        Return a JSON array of concept tags that match this search semantically.
      `;

      const conceptResponse = await base44.integrations.Core.InvokeLLM({
        prompt: conceptPrompt,
        response_json_schema: {
          type: 'object',
          properties: {
            concepts: {
              type: 'array',
              items: { type: 'string' }
            },
            explanation: { type: 'string' }
          }
        }
      });

      // Find courses matching these concepts
      const conceptMatches = courses.filter(c =>
        conceptResponse.concepts?.some(concept =>
          c.title?.toLowerCase().includes(concept.toLowerCase()) ||
          c.description?.toLowerCase().includes(concept.toLowerCase()) ||
          c.tags?.some(t => t.toLowerCase().includes(concept.toLowerCase()))
        )
      );

      setConceptualResults({
        courses: conceptMatches,
        concepts: conceptResponse.concepts,
        explanation: conceptResponse.explanation
      });
    } catch (error) {
      console.error('Concept search error:', error);
    }

    setSearching(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) handleSearch(query);
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by concept, emotion, or topic..."
          className="pl-12 pr-4 py-6 rounded-2xl text-lg font-serif border-2 border-slate-200 focus:border-blue-500 bg-white"
        />
        {searching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {(results.length > 0 || conceptualResults.courses?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="glass-effect border-0 premium-shadow-xl rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto">
              <CardContent className="p-4 space-y-4">
                {/* Direct Matches */}
                {results.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <BookOpen className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-900 font-serif">Direct Matches</span>
                    </div>
                    {results.slice(0, 5).map((course, idx) => (
                      <motion.button
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onSelect?.(course.id)}
                        className="w-full p-3 bg-white hover:bg-blue-50 rounded-xl text-left transition-all border border-transparent hover:border-blue-200"
                      >
                        <div className="font-bold text-slate-900 font-serif">{course.title}</div>
                        <div className="text-sm text-slate-600 line-clamp-1">{course.description}</div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Conceptual Matches */}
                {conceptualResults.courses?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-bold text-slate-900 font-serif">Conceptually Related</span>
                    </div>
                    
                    {conceptualResults.explanation && (
                      <div className="p-3 bg-purple-50 rounded-xl mb-3 border border-purple-200">
                        <p className="text-xs text-purple-900 font-serif italic">
                          {conceptualResults.explanation}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {conceptualResults.concepts?.map((concept, idx) => (
                        <Badge key={idx} className="bg-purple-100 text-purple-800 font-serif">
                          {concept}
                        </Badge>
                      ))}
                    </div>

                    {conceptualResults.courses.slice(0, 5).map((course, idx) => (
                      <motion.button
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onSelect?.(course.id)}
                        className="w-full p-3 bg-white hover:bg-purple-50 rounded-xl text-left transition-all border border-transparent hover:border-purple-200 mb-2"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <div className="font-bold text-slate-900 font-serif">{course.title}</div>
                        </div>
                        <div className="text-sm text-slate-600 line-clamp-1">{course.description}</div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}