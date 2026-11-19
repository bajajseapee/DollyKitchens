import { useEffect, useState } from 'react';
import {
  APILoadingStatus,
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, Loader2, MapPin, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '../data/menuData';

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  (typeof __GOOGLE_MAPS_API_KEY__ !== 'undefined' ? __GOOGLE_MAPS_API_KEY__ : '');

const FALLBACK_SEARCH_QUERIES = [
  BUSINESS_INFO.mapsSearchQuery,
  "Dolly's Kitchen, Hudco Colony, Lonavala",
  'Hudco Colony, Lonavala, Maharashtra',
];

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  BUSINESS_INFO.mapsSearchQuery
)}`;

interface ResolvedLocation {
  position: google.maps.LatLngLiteral;
  displayName: string;
  formattedAddress: string;
  googleMapsUri?: string;
  viewport?: google.maps.LatLngBounds | null;
}

function isQuotaError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err ?? '');
  return (
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('OVER_QUERY_LIMIT') ||
    message.includes('QuotaExceededError') ||
    message.includes('429')
  );
}

function MapViewportHelper({ position }: { position: google.maps.LatLngLiteral }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(position);
  }, [map, position]);

  return null;
}

function LonavalaPlaceMap() {
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [resolved, setResolved] = useState<ResolvedLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    if (
      apiStatus === APILoadingStatus.AUTH_FAILURE ||
      apiStatus === APILoadingStatus.FAILED
    ) {
      if (apiStatus === APILoadingStatus.AUTH_FAILURE) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      setHasError(true);
      setIsLoading(false);
    }
  }, [apiStatus]);

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function resolveRestaurantLocation() {
      setIsLoading(true);
      setHasError(false);

      try {
        for (const query of FALLBACK_SEARCH_QUERIES) {
          const { places } = await placesLib!.Place.searchByText({
            textQuery: query,
            fields: ['displayName', 'formattedAddress', 'location', 'viewport', 'googleMapsURI'],
            language: 'en',
            region: 'IN',
            maxResultCount: 1,
          });

          const match = places?.[0];
          if (match?.location) {
            if (cancelled) return;
            setResolved({
              position: {
                lat: match.location.lat(),
                lng: match.location.lng(),
              },
              displayName: match.displayName || BUSINESS_INFO.name,
              formattedAddress: match.formattedAddress || BUSINESS_INFO.address,
              googleMapsUri: match.googleMapsURI || undefined,
              viewport: match.viewport ?? null,
            });
            setIsLoading(false);
            return;
          }
        }

        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    }

    void resolveRestaurantLocation();

    return () => {
      cancelled = true;
    };
  }, [placesLib]);

  const mapsTargetUrl = resolved?.googleMapsUri || DIRECTIONS_URL;

  if (hasError || (!isLoading && !resolved)) {
    return <LocationFallbackCard mapsUrl={mapsTargetUrl} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative w-full h-[300px] sm:h-[340px] bg-[#161214]">
        {isLoading || !resolved ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center px-6">
            <Loader2 className="w-6 h-6 text-[#F4C430] animate-spin" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-[#F5EBE1]/80">
              Loading Google Maps pin for Hudco Colony, Lonavala...
            </p>
          </div>
        ) : (
          <GoogleMap
            mapId="DEMO_MAP_ID"
            defaultCenter={resolved.position}
            defaultZoom={16}
            gestureHandling="cooperative"
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={true}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            <MapViewportHelper position={resolved.position} />

            <AdvancedMarker
              ref={markerRef}
              position={resolved.position}
              title={`${BUSINESS_INFO.name} — ${BUSINESS_INFO.address}`}
              onClick={() => setInfoOpen((prev) => !prev)}
            >
              <Pin
                background="#F4C430"
                borderColor="#7A1224"
                glyphColor="#161214"
                scale={1.15}
              />
            </AdvancedMarker>

            {infoOpen && marker && (
              <InfoWindow
                anchor={marker}
                maxWidth={260}
                onCloseClick={() => setInfoOpen(false)}
              >
                <div className="p-1 text-[#161214] space-y-1.5">
                  <p className="font-bold text-sm leading-snug">
                    {BUSINESS_INFO.name} ({BUSINESS_INFO.hindiName})
                  </p>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {BUSINESS_INFO.address}
                  </p>
                  <p className="text-[11px] font-medium text-neutral-600">
                    Open Daily: {BUSINESS_INFO.hours}
                  </p>
                  <a
                    href={mapsTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7A1224] hover:underline pt-0.5"
                  >
                    <Navigation className="w-3 h-3" aria-hidden="true" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Address & Direct Directions Footer */}
      <div className="p-4 sm:p-5 bg-[#1F191B] border-t border-[#E5A93C]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#E5A93C] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Kitchen Address</span>
          </p>
          <p className="text-xs sm:text-sm text-[#FFF8EE] font-medium mt-1 leading-relaxed">
            {BUSINESS_INFO.address}
          </p>
        </div>

        <a
          href={mapsTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-xs font-bold transition-colors whitespace-nowrap shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function LocationFallbackCard({ mapsUrl }: { mapsUrl: string }) {
  return (
    <div className="p-6 sm:p-8 flex flex-col justify-center items-center text-center min-h-[340px]">
      <div className="w-12 h-12 rounded-xl bg-[#2A060C] border border-[#E5A93C]/35 flex items-center justify-center mb-4">
        <MapPin className="w-6 h-6 text-[#F4C430]" aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl font-bold text-[#FFF8EE]">
        {BUSINESS_INFO.name}
      </h3>
      <p className="text-sm text-[#F5EBE1]/85 mt-2 max-w-sm leading-relaxed">
        {BUSINESS_INFO.address}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F4C430] hover:bg-[#E5A93C] text-[#161214] text-sm font-bold transition-colors"
      >
        <Navigation className="w-4 h-4" aria-hidden="true" />
        <span>Open in Google Maps</span>
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}

export function LocationMap() {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="lg:col-span-5 rounded-xl bg-[#1F191B] border border-[#E5A93C]/25 overflow-hidden">
        <LocationFallbackCard mapsUrl={DIRECTIONS_URL} />
      </div>
    );
  }

  return (
    <div className="lg:col-span-5 rounded-xl bg-[#1F191B] border border-[#E5A93C]/25 overflow-hidden flex flex-col">
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        language="en"
        region="IN"
        libraries={['places', 'marker']}
      >
        <LonavalaPlaceMap />
      </APIProvider>
    </div>
  );
}
