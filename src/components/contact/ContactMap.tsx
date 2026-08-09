"use client";

import React, { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import MapPoints, { MobileOfficePopup } from './MapPoints';

const ContactMap = () => {
  const [activeOffice, setActiveOffice] = useState<string | null>(null);

  const handleActiveOfficeChange = useCallback((office: string | null) => {
    setActiveOffice(office);
  }, []);

  const closeOfficePopup = useCallback(() => {
    setActiveOffice(null);
  }, []);

  return (
    <>
      <div className="w-full h-screen sticky top-0 overflow-hidden z-10">
        <Canvas
          camera={{ position: [0, 0, 500], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <MapPoints
              activeOffice={activeOffice}
              onActiveOfficeChange={handleActiveOfficeChange}
            />
          </Suspense>
        </Canvas>
      </div>
      <MobileOfficePopup office={activeOffice} onClose={closeOfficePopup} />
    </>
  );
};

export default ContactMap;
