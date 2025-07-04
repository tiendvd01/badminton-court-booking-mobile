import useSocketRevalidate from '@/hooks/useSocketRevalidate';
import React from 'react';

function FrameGlobal({ children }: { children: React.ReactNode }) {
    useSocketRevalidate();
    return <>{children}</>;
}

export default FrameGlobal;
