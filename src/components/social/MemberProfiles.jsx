import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Award, BookOpen, MessageCircle, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberProfiles({ members, onConnect }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members?.map((member, idx) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -4 }}
        >
          <Card className="card-modern border-white/60 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-blue-900 to-purple-900 relative">
              {member.cover_image && (
                <img src={member.cover_image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            
            <CardContent className="p-6 -mt-12 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                {member.avatar ? (
                  <img src={member.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>

              <div className="text-center mb-4">
                <h3 className="font-black text-xl text-slate-900 font-serif mb-1">
                  {member.name}
                </h3>
                {member.location && (
                  <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
                    <MapPin className="w-3 h-3" />
                    {member.location}
                  </div>
                )}
                {member.bio && (
                  <p className="text-sm text-slate-600 mt-2 font-serif line-clamp-2">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-black text-slate-900">{member.courses_completed || 0}</div>
                  <div className="text-xs text-slate-600">Courses</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <Award className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-black text-slate-900">{member.achievements || 0}</div>
                  <div className="text-xs text-slate-600">Awards</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <Star className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <div className="text-lg font-black text-slate-900">{member.level || 1}</div>
                  <div className="text-xs text-slate-600">Level</div>
                </div>
              </div>

              {/* Interests */}
              {member.interests && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.interests.slice(0, 3).map((interest, i) => (
                    <Badge key={i} variant="outline" className="font-serif text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}

              <Button
                onClick={() => onConnect?.(member.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl font-serif"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}