import React from 'react';

const TopWave = ({ fill = '#ffffff' }) => (
    <div
        className="hero-wave"
        style={{
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            width: '100%',
            lineHeight: 0,
            zIndex: 1,
            pointerEvents: 'none'
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '250px' }}
        >
            <path
                fill={fill}
                d="M0,192L40,197.3C80,203,160,213,240,197.3C320,181,400,139,480,138.7C560,139,640,181,720,197.3C800,213,880,203,960,181.3C1040,160,1120,128,1200,128C1280,128,1360,160,1400,176L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            />
        </svg>
    </div>
);

export default TopWave;
