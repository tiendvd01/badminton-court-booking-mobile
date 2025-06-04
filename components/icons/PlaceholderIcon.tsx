import React from 'react';
import Svg, { Rect, Defs, Pattern, Image, SvgXml } from 'react-native-svg';

interface PlaceholderIconProps {
    size?: number;
    color?: string;
}

export default function PlaceholderIcon({ size = 24, color = '' }: PlaceholderIconProps) {
    // SVG content as a string
    const svgContent = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="24" height="24" fill="url(#pattern0_21_90)"/>
<defs>
<pattern id="pattern0_21_90" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_21_90" transform="scale(0.015625)"/>
</pattern>
<image id="image0_21_90" width="64" height="64" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABuwAAAbsBOuzj4gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAbnSURBVHicxZt/bJ1VGcc/z3nf9/ZuK71d5zYpUaOiUQNbhRi2tgYXdUFxosYQidHoYoxOEfEHEQN/6IzJMNtMDP6BgsFkCCaaEE2MyQyZY+0mhdu1lSCVuEQUXKDrGvrr3vuexz/KsJTe7jzv+97r57+23+fH+fbcc+97zrmiqrQcEQc7d3jcdaBvFuhVuAzoPctUp+DqDpkVZNrhno2QIxVO34tqo+WttcwAEUkZ+JCgHwf2AFtXkz3Pi6uGO8QnxJOC+1UPY/tR9S1psxUGNGTwgw49ALz7YtpmBiwnIp4vE3+voqMHiuhvOcUaIAN9ivxI0Q+EhoQYcIES8VRCvK+iow9l6m8VXFGJUunf6+GUZfBWajR6Zll4cFr67isqZ/4ZIDdGnn8dBG7JEm6ZAcspk4z2oNegE7VMCV4mnwGyq6zUHlbYnTVFVgMAEuIXE5LLu7U6nTVHrpeAp3ZfnsHnpU5jU0pjNE+OzAZ4GbwduClP8SJYpP6mKdn2x6zxmQxI5b17QH+QtWjRLFDbPSV9+7PE2tcA2dXpqT0DbMlScCV51oDlOMRfQqV3g578jyUuthby1L5FvsHPKFQFRhR9fB3lfo/f4fGXp6QVj0qWpB51C8w9tAHeZ4mzzQDZsdUT/R3otLUHwKSDL8DQcZoVFXEzbP/KPPWDKWliLeAQ7aS0rVNPT4THGPC4O7APXkHudiz2oSf+3HTwAKq+S0d/sp5Gb5nSuLEOHpUa/oglJnwGyK7YUzsLbDTkn/P4G2IdPmpp6gLnZNttC9QPKOGzVBC9lNevRx9ZCNEHz4AGi9diGzygt2UdPMBGHburTPJrU0VUzjP11VB9sAEOPmZpRJCjjuGfWmJWYyPjN5WIpywxKf4zoVrDGiAfNfRwXoj2rvl6D0XVlyh/2CHBueqk7wrVhhkgA1uAN4YmBe5Fj/3ToF+TLh05lZA8EapP8fFLclWQCaEzoDe0OICiIxZ9CA43bNGn+CvD8gYl4zJL8YjocYs+BAe/s+gVfWdg3iAsM2AGHp006IOocPqoZR1QeEuILsgAQTeFFgYmC1n8VqLqHW4+WB74cT3IAEWeDS0MvA2RTJ/n10TEefy6YDlyJkQXZEAEz4QWBrpg4O0GfRAzXLXb8qDkoBqoC8JiACn+aos+LGf6EYs+Qk+E6MIM0BNngZdCiwvuPaHaUDy+P7y+EPpEaHkaNMwC3Ytc+wZD7jWZkat31Kn3heodLuhBaEkbzlMGbZeS3mPQr8kii7+3vf7l+XBtIB79RagWQNHrUhn4vCVmNc7J9l/WaVjehukgPhSqNe0IeRkYB64w9DLtcHvQ448aYv4XLH23LrB40PLfj3HzW/TJ9aF6046QoocteqDb44956T+E9Ae/h8/IFT0vyJWjcywcsu4Rlig9aNGbDIjoPgKYdl2XasitHhltyOAu5MaoqVIknpG+m+fR52rUtxvrIIiCfMMUY/3U6qX/TpDvm4Jehc4qUhX0MYWRGeb6PX6nx7+1QVqxbH+tpIPS8CYdC367hEznAv09HpkEemyBq1PUuYAg2knXOy7RU09b4uwnQzo0BdxujmsxZZIj1sFD1tNhEUnZOSzINfbgV1PEDIiJZrfwZHeWO0XZDkdVNYIvA2mm+IIpE30x64Wq7MfjOlQF7s4cXxBlSuNdOvZA1vhc9wMc6Z3Ac3ly5Ksvfh16fb4cedCTMwqm990i6aDjZ+t0PNfucyG3xFQGjiq8P0ts1kUwIZ7erBPGk6rXUsgtMcHtA3JdVrKSkHyuiDzFXJPT408DdxWSK4AyyV+6tfpwEbkKuyfo0B+C/qOofM2IkLRO156i8hVmADo0r8jNheVrQony4a1LW3SFUPhdYZXB3+rSBekgLItgQvzCZp3YnKmxJhQ3A15GiG4BnS06L0CJ6FNF5yzcgKVT4TyPy6vTQelYRU//qei8xRsAOBYPA38tKl9EVI+ITBc0QmmJAehI3cG+otJ1kOzPcx94LVr3jRHAy+D9oJ9dS3OxRbBE/O/X6YTpeN5Ca2bAK8n128C5rPGCUKL8iQJbeg0tNWDpSE2+mzW8TOkPXTpyqsiWVtJaAwDHiXsUHrPGRUSLCySfbEVPy2m5Aaj6CP8lwPStrw5K37lUR+Za1NUrtN4AAB1+AjT4zmBCfKZbqz9uZUsXaI8BgKN2BwGHlg7RGLmhHT0t1WsXOnJe8d+8mKxM6TcbdXysHS1BOw0AIh16QOCRpn8nnu8m/XQ7e2qrAQCCNt09KpN8Le/X4Ky03QB06CnQgyt/3UHyt4pWf97udtpvwFLR/cCZCz8LoglxYbs8xl7+D+jQvCO6XuFkhGtsoPT1Lq0Wfrs0hP8CyhNqluFlQpMAAAAASUVORK5CYII="/>
</defs>
</svg>

  `;

    return <SvgXml xml={svgContent} width={size} height={size} />;
}
