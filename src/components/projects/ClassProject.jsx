import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, Users, Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function ClassProject({ projectId }) {
  const project = {
    title: 'Create a Breslov-Inspired Art Piece',
    description: 'Express a teaching from Likutey Moharan through creative art',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    teamSize: 4,
    currentMembers: 3,
    submissions: 2,
    totalTasks: 5
  };

  const progressPercent = (project.submissions / project.totalTasks) * 100;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Folder className="w-5 h-5 text-purple-600" />
          Group Project
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-bold text-slate-900 text-xl mb-2">{project.title}</div>
          <p className="text-sm text-slate-600">{project.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900">
              {project.currentMembers}/{project.teamSize}
            </div>
            <div className="text-xs text-slate-600">Team</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <File className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-2xl font-black text-slate-900">
              {project.submissions}/{project.totalTasks}
            </div>
            <div className="text-xs text-slate-600">Tasks</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700">Progress</span>
            <span className="font-bold text-slate-900">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl">
          <Upload className="w-4 h-4 mr-2" />
          Upload Contribution
        </Button>
      </CardContent>
    </Card>
  );
}