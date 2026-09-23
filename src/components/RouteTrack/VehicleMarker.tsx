/**
 * The truck-and-pointer marker that rides the filled head of a `RouteTrack`.
 *
 * Exported verbatim from the Figma component `Truck pointer` (10746:10939),
 * with only the two fills swapped for tokens: `#818CF8` (button/primary/
 * background) became `currentColor`, and `#AAB1F9` (button/primary/border)
 * became the `--_route-marker-catch` custom property the stylesheet sets.
 * Everything else — the doubled paths that make the 1px glass catch, and the
 * four filters carrying the #6570e1 vignette and the drop shadows — is
 * Figma's own output, kept as-is rather than reconstructed by hand.
 *
 * **The box is 52x43, not 37x32.** Figma exports with the shadow bleed
 * included; the component's logical box is the 37x32 region starting at
 * (8, 7) inside it. RouteTrack.module.css offsets the svg by exactly that,
 * so the wrapper measures the truck itself and the shadows spill outside it.
 */
export function VehicleMarker() {
  return (
    <svg aria-hidden="true" focusable="false" width="52" height="43" viewBox="0 0 52 43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_dRouteMarker)">
    <path d="M43.9287 17.1358L42.1787 11.5146C42.0302 11.1499 41.7738 10.8376 41.4428 10.6181C41.1119 10.3986 40.7215 10.2821 40.3225 10.2837H35V7.98473C35 7.72356 34.8946 7.47309 34.7071 7.28842C34.5196 7.10375 34.2652 7 34 7H10C9.46957 7 8.96086 7.2075 8.58579 7.57684C8.21071 7.94619 8 8.44712 8 8.96946V24.0686C8 24.591 8.21071 25.0919 8.58579 25.4612C8.96086 25.8306 9.46957 26.0381 10 26.0381H10.7917C11.012 26.8854 11.5124 27.6363 12.214 28.1726C12.9156 28.7089 13.7785 29 14.6667 29C15.5548 29 16.4177 28.7089 17.1194 28.1726C17.821 27.6363 18.3214 26.8854 18.5417 26.0381H31.125C31.3453 26.8854 31.8457 27.6363 32.5473 28.1726C33.2489 28.7089 34.1118 29 35 29C35.8882 29 36.7511 28.7089 37.4527 28.1726C38.1543 27.6363 38.6547 26.8854 38.875 26.0381H42C42.5304 26.0381 43.0391 25.8306 43.4142 25.4612C43.7893 25.0919 44 24.591 44 24.0686V17.5051C44.0001 17.3786 43.976 17.2533 43.9287 17.1358ZM14.6667 27.0228C14.2711 27.0228 13.8844 26.9073 13.5555 26.6909C13.2266 26.4745 12.9703 26.1669 12.8189 25.807C12.6675 25.4472 12.6279 25.0512 12.7051 24.6691C12.7823 24.2871 12.9727 23.9362 13.2525 23.6607C13.5322 23.3853 13.8885 23.1977 14.2765 23.1217C14.6644 23.0458 15.0666 23.0848 15.432 23.2338C15.7975 23.3829 16.1098 23.6353 16.3296 23.9592C16.5494 24.2831 16.6667 24.6638 16.6667 25.0534C16.6667 25.5757 16.456 26.0766 16.0809 26.446C15.7058 26.8153 15.1971 27.0228 14.6667 27.0228ZM35 27.0228C34.6044 27.0228 34.2178 26.9073 33.8889 26.6909C33.56 26.4745 33.3036 26.1669 33.1522 25.807C33.0009 25.4472 32.9613 25.0512 33.0384 24.6691C33.1156 24.2871 33.3061 23.9362 33.5858 23.6607C33.8655 23.3853 34.2219 23.1977 34.6098 23.1217C34.9978 23.0458 35.3999 23.0848 35.7654 23.2338C36.1308 23.3829 36.4432 23.6353 36.6629 23.9592C36.8827 24.2831 37 24.6638 37 25.0534C37 25.5757 36.7893 26.0766 36.4142 26.446C36.0391 26.8153 35.5304 27.0228 35 27.0228ZM35 16.5203V12.2532H40.3225L41.5225 16.5203H35Z" fill="var(--_route-marker-catch)"/>
    </g>
    <g filter="url(#filter1_iRouteMarker)">
    <path d="M44.9288 17.1358L43.1788 11.5146C43.0302 11.1499 42.7738 10.8376 42.4428 10.6181C42.1119 10.3986 41.7215 10.2821 41.3225 10.2837H36V7.98473C36 7.72356 35.8946 7.47309 35.7071 7.28842C35.5196 7.10375 35.2652 7 35 7H11C10.4696 7 9.96086 7.2075 9.58579 7.57684C9.21071 7.94619 9 8.44712 9 8.96946V24.0686C9 24.591 9.21071 25.0919 9.58579 25.4612C9.96086 25.8306 10.4696 26.0381 11 26.0381H11.7917C12.012 26.8854 12.5124 27.6363 13.214 28.1726C13.9156 28.7089 14.7785 29 15.6667 29C16.5548 29 17.4177 28.7089 18.1194 28.1726C18.821 27.6363 19.3214 26.8854 19.5417 26.0381H32.125C32.3453 26.8854 32.8457 27.6363 33.5473 28.1726C34.2489 28.7089 35.1118 29 36 29C36.8882 29 37.7511 28.7089 38.4527 28.1726C39.1543 27.6363 39.6547 26.8854 39.875 26.0381H43C43.5304 26.0381 44.0391 25.8306 44.4142 25.4612C44.7893 25.0919 45 24.591 45 24.0686V17.5051C45.0002 17.3786 44.976 17.2533 44.9288 17.1358ZM15.6667 27.0228C15.2711 27.0228 14.8844 26.9073 14.5555 26.6909C14.2266 26.4745 13.9703 26.1669 13.8189 25.807C13.6675 25.4472 13.6279 25.0512 13.7051 24.6691C13.7823 24.2871 13.9727 23.9362 14.2525 23.6607C14.5322 23.3853 14.8885 23.1977 15.2765 23.1217C15.6644 23.0458 16.0666 23.0848 16.432 23.2338C16.7975 23.3829 17.1098 23.6353 17.3296 23.9592C17.5494 24.2831 17.6667 24.6638 17.6667 25.0534C17.6667 25.5757 17.456 26.0766 17.0809 26.446C16.7058 26.8153 16.1971 27.0228 15.6667 27.0228ZM36 27.0228C35.6044 27.0228 35.2178 26.9073 34.8889 26.6909C34.56 26.4745 34.3036 26.1669 34.1522 25.807C34.0009 25.4472 33.9613 25.0512 34.0384 24.6691C34.1156 24.2871 34.3061 23.9362 34.5858 23.6607C34.8655 23.3853 35.2219 23.1977 35.6098 23.1217C35.9978 23.0458 36.3999 23.0848 36.7654 23.2338C37.1308 23.3829 37.4432 23.6353 37.6629 23.9592C37.8827 24.2831 38 24.6638 38 25.0534C38 25.5757 37.7893 26.0766 37.4142 26.446C37.0391 26.8153 36.5304 27.0228 36 27.0228ZM36 16.5203V12.2532H41.3225L42.5225 16.5203H36Z" fill="currentColor"/>
    </g>
    <g filter="url(#filter2_dRouteMarker)">
    <path d="M27.1495 37.875C26.8608 38.375 26.1392 38.375 25.8505 37.875L21.9534 31.125C21.6647 30.625 22.0255 30 22.6029 30L30.3971 30C30.9745 30 31.3353 30.625 31.0466 31.125L27.1495 37.875Z" fill="var(--_route-marker-catch)"/>
    </g>
    <g filter="url(#filter3_iRouteMarker)">
    <path d="M27.6495 36.875C27.3608 37.375 26.6392 37.375 26.3505 36.875L22.8864 30.875C22.5977 30.375 22.9585 29.75 23.5359 29.75L30.4641 29.75C31.0415 29.75 31.4023 30.375 31.1136 30.875L27.6495 36.875Z" fill="currentColor"/>
    </g>
    <defs>
    <filter id="filter0_dRouteMarker" x="4.76837e-07" y="4.76837e-07" width="52" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="4"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadowRouteMarker"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadowRouteMarker" result="shape"/>
    </filter>
    <filter id="filter1_iRouteMarker" x="9" y="7" width="38" height="24" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dx="2" dy="2"/>
    <feGaussianBlur stdDeviation="8"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.396078 0 0 0 0 0.439216 0 0 0 0 0.882353 0 0 0 1 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadowRouteMarker"/>
    </filter>
    <filter id="filter2_dRouteMarker" x="18.8516" y="28" width="15.2969" height="14.25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1.5"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadowRouteMarker"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadowRouteMarker" result="shape"/>
    </filter>
    <filter id="filter3_iRouteMarker" x="22.7852" y="29.75" width="9.17969" height="8.25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dx="0.75" dy="0.75"/>
    <feGaussianBlur stdDeviation="3"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.396078 0 0 0 0 0.439216 0 0 0 0 0.882353 0 0 0 1 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadowRouteMarker"/>
    </filter>
    </defs>
    </svg>
  );
}
