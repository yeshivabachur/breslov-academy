import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Download, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificateGenerator({ courseData, userData }) {
  const certificate = {
    studentName: userData?.full_name || 'Student Name',
    courseTitle: courseData?.title || 'Course Title',
    instructor: courseData?.instructor || 'Instructor',
    completionDate: new Date(),
    certificateNumber: `BRA-${Date.now().toString().slice(-6)}`,
    hours: courseData?.duration_hours || 0
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2rem]">
      <CardContent className="p-12">
        <div className="bg-gradient-to-br from-amber-50 via-white to-blue-50 p-12 rounded-2xl border-8 border-double border-amber-600">
          <div className="text-center space-y-6">
            <Award className="w-24 h-24 text-amber-600 mx-auto" />
            
            <div className="text-sm uppercase tracking-widest text-slate-600">
              Certificate of Completion
            </div>

            <div className="text-5xl font-black text-slate-900">
              {certificate.studentName}
            </div>

            <div className="text-lg text-slate-700 font-serif max-w-lg mx-auto">
              has successfully completed the sacred study of
            </div>

            <div className="text-3xl font-black text-blue-900">
              {certificate.courseTitle}
            </div>

            <div className="text-slate-600">
              under the guidance of <span className="font-bold">{certificate.instructor}</span>
            </div>

            <div className="pt-6 border-t-2 border-amber-200">
              <div className="text-sm text-slate-600">
                {certificate.completionDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Certificate #{certificate.certificateNumber}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}