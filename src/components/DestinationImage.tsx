import React, { useEffect, useState } from 'react';

interface DestinationImageProps {
  destination: string;
}

const DestinationImage: React.FC<DestinationImageProps> = ({ destination }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const UNSPLASH_ACCESS_KEY = 'AZColEsfVopCurOn-ik7QtGkmS_DkPucUxCotTwcChk';

  useEffect(() => {
    if (!destination) return;

    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      setImageLoaded(false);
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1&orientation=landscape`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setImageUrl(data.results[0].urls.regular);
        } else {
          setError('No images found for this destination');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setError('Failed to load destination image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [destination]);

  if (!destination) return null;

  return (
    <div className="relative h-64 md:h-96 w-full mb-8 overflow-hidden rounded-lg shadow-lg">
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <span role="img" aria-label="error" className="text-4xl mb-2">🏞️</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={`${destination} destination`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/60">
            <div className="absolute top-0 left-0 right-0 p-8 pt-12">
              <div className="flex items-center">
                <span className="text-white text-2xl mr-3">✈️</span>
                <h2 className="text-white text-4xl font-bold">{destination}</h2>
              </div>
              <p className="text-white/80 mt-2 ml-10">Discover the beauty of your destination</p>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white/80 text-sm">Your adventure awaits</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationImage; 