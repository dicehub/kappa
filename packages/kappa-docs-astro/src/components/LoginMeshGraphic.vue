<template>
  <svg
    class="login-mesh-graphic"
    viewBox="0 0 560 720"
    fill="none"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="login-mesh-plane" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#ffbd73" stop-opacity="0.38" />
        <stop offset="1" stop-color="#ff8a3d" stop-opacity="0.06" />
      </linearGradient>
      <radialGradient id="login-mesh-ambient" cx="0" cy="0" r="1" gradientTransform="translate(309 331) rotate(113) scale(456 424)" gradientUnits="userSpaceOnUse">
        <stop stop-color="#14313a" />
        <stop offset="0.62" stop-color="#08181f" />
        <stop offset="1" stop-color="#041015" />
      </radialGradient>
      <filter id="login-mesh-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    <rect width="560" height="720" fill="url(#login-mesh-ambient)" />
    <g class="login-mesh-graphic__background-grid">
      <path d="M0 120H560M0 240H560M0 360H560M0 480H560M0 600H560" />
      <path d="M80 0V720M200 0V720M320 0V720M440 0V720" />
    </g>

    <g class="login-mesh-graphic__mesh">
      <path class="login-mesh-graphic__outline" d="m80 201 223-102 172 92-219 106Z" />
      <path class="login-mesh-graphic__outline" d="m80 201 176 96v288L80 488ZM256 297l219-106v286L256 585Z" />
      <path class="login-mesh-graphic__outline" d="m80 488 176 97 219-108" />

      <path d="m108 188 176 96M136 175l176 95M164 162l176 94M192 150l176 92M220 137l176 91M248 124l176 89M276 111l176 88" />
      <path d="m101 212 221-102M123 224l221-102M146 236l221-102M168 248l221-102M190 260l221-102M213 272l221-102M235 284l221-102" />

      <path d="m80 242 176 96M80 283l176 96M80 324l176 96M80 365l176 96M80 406l176 96M80 447l176 96" />
      <path d="M105 215v287M130 229v287M155 242v288M180 256v288M205 270v288M230 283v288" />

      <path d="m256 338 219-106M256 379l219-106M256 420l219-106M256 461l219-106M256 502l219-106M256 543l219-106" />
      <path d="M287 282v288M318 267v288M350 252v288M381 237v287M412 222v287M444 207v287" />
    </g>

    <g class="login-mesh-graphic__slice">
      <path filter="url(#login-mesh-glow)" d="m80 331 176 96 219-106-172-93Z" fill="#ff9a4c" opacity="0.2" />
      <path d="m80 331 176 96 219-106-172-93Z" fill="url(#login-mesh-plane)" stroke="#ffc27e" />
      <circle cx="256" cy="427" r="4" fill="#fff0d5" />
    </g>

    <g class="login-mesh-graphic__axes">
      <path d="M80 617h74M80 617v-74" />
      <path d="m154 617-11-6v12ZM80 543l-6 11h12Z" fill="currentColor" stroke="none" />
      <text x="164" y="622">X</text>
      <text x="74" y="532">Z</text>
    </g>
  </svg>
</template>

<style scoped>
.login-mesh-graphic {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.login-mesh-graphic__background-grid {
  opacity: 0.16;
  stroke: #4d858d;
  stroke-width: 0.75;
}

.login-mesh-graphic__mesh {
  opacity: 0.7;
  stroke: #61b7ba;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 0.8;
  vector-effect: non-scaling-stroke;
}

.login-mesh-graphic__outline {
  opacity: 0.88;
  stroke: #a1e1dd;
  stroke-width: 1.4;
}

.login-mesh-graphic__slice {
  animation: login-mesh-slice 5s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
  transform-box: fill-box;
  transform-origin: center;
}

.login-mesh-graphic__axes {
  color: #84c6c7;
  opacity: 0.7;
  stroke: currentColor;
  stroke-width: 1.5;
}

.login-mesh-graphic__axes text {
  fill: currentColor;
  font-family: var(--kappa-font-mono, monospace);
  font-size: 12px;
  stroke: none;
}

@keyframes login-mesh-slice {
  to { transform: translateY(84px); }
}

@media (prefers-reduced-motion: reduce) {
  .login-mesh-graphic__slice { animation: none; }
}
</style>
