import React, { useState } from 'react';
import { CompositionGuideType, PhotographyMode, CapturedPhoto } from '../types/camera';
import { Header } from '../components/Header';
import { CameraView } from '../components/CameraView';
import { PhotoReviewModal } from '../components/PhotoReviewModal';
import { AcademyModal } from '../components/AcademyModal';
import { Gallery } from '../components/Gallery';
import { MadeWithDyad } from '../components/made-with-dyad';
import { showSuccess } from '../utils/toast';

const Index: React.FC = () => {
  const [guide, setGuide] = useState<CompositionGuideType>('thirds');
  const [mode, setMode] = useState<PhotographyMode>('portrait');
  
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [activePhoto, setActivePhoto] = useState<CapturedPhoto | null>(null);
  const [isAcademyOpen, setIsAcademyOpen] = useState<boolean>(false);

  const handlePhotoCaptured = (photo: CapturedPhoto) => {
    setPhotos((prev) => [photo, ...prev]);
    setActivePhoto(photo);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showSuccess("Photo removed from gallery.");
  };

  const handleClearAll = () => {
    setPhotos([]);
    showSuccess("Gallery cleared.");
  };

  const handleApplyLesson = (newGuide: CompositionGuideType, newMode: PhotographyMode) => {
    setGuide(newGuide);
    setMode(newMode);
    showSuccess(`Applied ${newGuide.replace('_', ' ')} guide & ${newMode} mode!`);
  };

  const averageScore =
    photos.length > 0
      ? Math.round(photos.reduce((acc, p) => acc + p.analysis.overallScore, 0) / photos.length)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        photoCount={photos.length}
        averageScore={averageScore}
        onOpenAcademy={() => setIsAcademyOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Main Interactive Camera Viewport */}
        <section>
          <CameraView
            guide={guide}
            setGuide={setGuide}
            mode={mode}
            setMode={setMode}
            onPhotoCaptured={handlePhotoCaptured}
            onOpenAcademy={() => setIsAcademyOpen(true)}
          />
        </section>

        {/* Portfolio Gallery */}
        <section>
          <Gallery
            photos={photos}
            onSelectPhoto={(photo) => setActivePhoto(photo)}
            onClearAll={handleClearAll}
          />
        </section>
      </main>

      {/* Captured Photo Analysis Scorecard Dialog */}
      <PhotoReviewModal
        photo={activePhoto}
        onClose={() => setActivePhoto(null)}
        onDelete={handleDeletePhoto}
      />

      {/* Interactive Masterclass & Lessons Dialog */}
      <AcademyModal
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        onApplyLesson={handleApplyLesson}
      />

      <footer className="border-t border-slate-800/80 py-4 mt-8">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;