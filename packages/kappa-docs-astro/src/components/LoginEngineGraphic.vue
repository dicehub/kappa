<template>
  <svg
    class="login-engine-graphic"
    viewBox="0 0 480 720"
    fill="none"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <marker id="engine-arrow-fuel" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 8 4 0 8Z" fill="#e9903d" />
      </marker>
      <marker id="engine-arrow-oxidizer" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 8 4 0 8Z" fill="#d8bc7a" />
      </marker>
      <marker id="engine-arrow-gas" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 8 4 0 8Z" fill="#ffd195" />
      </marker>
    </defs>

    <rect width="480" height="720" fill="#050403" />

    <g class="login-engine-graphic__grid">
      <path d="M24 80H456M24 200H456M24 320H456M24 440H456M24 560H456M24 680H456" />
      <path d="M80 44V688M160 44V688M240 44V688M320 44V688M400 44V688" />
    </g>

    <g class="login-engine-graphic__registration">
      <path d="M26 52h26M39 39v26M428 52h26M441 39v26M26 672h26M39 659v26M428 672h26M441 659v26" />
      <path d="M240 42v24M228 54h24" />
    </g>

    <g class="login-engine-graphic__hardware">
      <g data-cycle-part="fuel-reservoir">
        <path d="M76 56h32l7 11v39l-7 11H76l-7-11V67Z" />
        <path d="M75 78h34M75 97h34M84 56V45h16v11" />
      </g>
      <g data-cycle-part="oxidizer-reservoir">
        <path d="M372 56h32l7 11v39l-7 11h-32l-7-11V67Z" />
        <path d="M371 78h34M371 97h34M380 56V45h16v11" />
      </g>

      <g data-cycle-part="fuel-pump">
        <circle cx="100" cy="156" r="27" />
        <circle cx="100" cy="156" r="6" />
        <path d="M100 132c8 0 16 4 20 10l-14 5-6-15ZM124 156c0 8-4 16-10 20l-5-14 15-6ZM100 180c-8 0-16-4-20-10l14-5 6 15ZM76 156c0-8 4-16 10-20l5 14-15 6Z" />
      </g>
      <g data-cycle-part="fuel-turbine">
        <circle cx="190" cy="156" r="27" />
        <circle cx="190" cy="156" r="6" />
        <path d="m190 130 7 18 18 8-18 7-7 19-7-19-18-7 18-8Z" />
      </g>
      <path class="login-engine-graphic__shaft" d="M127 156h36" />
      <path class="login-engine-graphic__shaft-detail" d="M135 151v10M145 151v10M155 151v10" />

      <g data-cycle-part="oxidizer-turbine">
        <circle cx="290" cy="156" r="27" />
        <circle cx="290" cy="156" r="6" />
        <path d="m290 130 7 18 18 8-18 7-7 19-7-19-18-7 18-8Z" />
      </g>
      <g data-cycle-part="oxidizer-pump">
        <circle cx="380" cy="156" r="27" />
        <circle cx="380" cy="156" r="6" />
        <path d="M380 132c8 0 16 4 20 10l-14 5-6-15ZM404 156c0 8-4 16-10 20l-5-14 15-6ZM380 180c-8 0-16-4-20-10l14-5 6 15ZM356 156c0-8 4-16 10-20l5 14-15 6Z" />
      </g>
      <path class="login-engine-graphic__shaft" d="M317 156h36" />
      <path class="login-engine-graphic__shaft-detail" d="M325 151v10M335 151v10M345 151v10" />

      <g data-cycle-part="fuel-rich-preburner">
        <path d="M144 260h82v58h-82Z" />
        <path d="M153 271h64M153 282h64M153 293h64M153 304h64" />
        <path d="M159 260v58M211 260v58" />
      </g>
      <g data-cycle-part="oxidizer-rich-preburner">
        <path d="M254 260h82v58h-82Z" />
        <path d="M263 271h64M263 282h64M263 293h64M263 304h64" />
        <path d="M269 260v58M321 260v58" />
      </g>

      <g data-cycle-part="main-injector">
        <path d="M192 398h96v42h-96Z" />
        <path d="M240 398v42M200 410h80M200 425h80" />
        <path d="M207 410v15M218 410v15M229 410v15M251 410v15M262 410v15M273 410v15" />
      </g>

      <g data-cycle-part="main-chamber">
        <path class="login-engine-graphic__outline" d="M202 440v60c0 15 7 27 23 39L112 658c82 23 174 23 256 0L255 539c16-12 23-24 23-39v-60Z" />
        <path d="M225 539h30M203 563c24 8 50 8 74 0M180 588c40 12 80 12 120 0M151 620c59 17 119 17 178 0M112 658c82 23 174 23 256 0" />
        <path d="m225 539-91 113M234 539l-58 127M240 539v136M246 539l58 127M255 539l91 113" />
      </g>
    </g>

    <g class="login-engine-graphic__fuel-flow">
      <path d="M92 117v11H61v28h12" marker-end="url(#engine-arrow-fuel)" />
      <path d="M100 183v24H55v410h73" marker-end="url(#engine-arrow-fuel)" />
      <path class="login-engine-graphic__cooling-jacket" d="M128 617 220 536l-24-36v-60" marker-end="url(#engine-arrow-fuel)" />
      <path d="M196 440V229h-31v31" marker-end="url(#engine-arrow-fuel)" />
      <path class="login-engine-graphic__cross-feed" d="M196 237h74v23" marker-end="url(#engine-arrow-fuel)" />
    </g>

    <g class="login-engine-graphic__oxidizer-flow">
      <path d="M388 117v11h31v28h-12" marker-end="url(#engine-arrow-oxidizer)" />
      <path d="M380 183v46h-59v31" marker-end="url(#engine-arrow-oxidizer)" />
      <path class="login-engine-graphic__cross-feed" d="M380 218H210v42" marker-end="url(#engine-arrow-oxidizer)" />
    </g>

    <g class="login-engine-graphic__hot-gas-flow">
      <path d="M185 260v-48h5v-29" marker-end="url(#engine-arrow-gas)" />
      <path d="M295 260v-48h-5v-29" marker-end="url(#engine-arrow-gas)" />
      <path d="M217 156h12v242" marker-end="url(#engine-arrow-gas)" />
      <path d="M263 156h-12v242" marker-end="url(#engine-arrow-gas)" />
    </g>

    <g class="login-engine-graphic__combustion-flow">
      <path d="M218 440c2 20 9 34 22 45 13-11 20-25 22-45" />
      <path d="M240 445v73" marker-end="url(#engine-arrow-gas)" />
    </g>
  </svg>
</template>

<style scoped>
.login-engine-graphic {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.login-engine-graphic__grid {
  opacity: 0.14;
  stroke: #754019;
  stroke-width: 0.75;
}

.login-engine-graphic__registration {
  opacity: 0.48;
  stroke: #b76522;
  stroke-width: 1;
}

.login-engine-graphic__hardware {
  stroke: #9d571f;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.15;
  vector-effect: non-scaling-stroke;
}

.login-engine-graphic__shaft {
  stroke: #dc9145;
  stroke-width: 3;
}

.login-engine-graphic__shaft-detail {
  opacity: 0.7;
  stroke: #dc9145;
}

.login-engine-graphic__outline {
  stroke: #dc9145;
  stroke-width: 1.5;
}

.login-engine-graphic__fuel-flow,
.login-engine-graphic__oxidizer-flow,
.login-engine-graphic__hot-gas-flow,
.login-engine-graphic__combustion-flow {
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.login-engine-graphic__fuel-flow {
  stroke: #e9903d;
  stroke-width: 2;
}

.login-engine-graphic__oxidizer-flow {
  stroke: #d8bc7a;
  stroke-width: 2;
}

.login-engine-graphic__cross-feed {
  opacity: 0.74;
  stroke-width: 1.1;
}

.login-engine-graphic__cooling-jacket {
  stroke-width: 2.6;
}

.login-engine-graphic__hot-gas-flow,
.login-engine-graphic__combustion-flow {
  stroke: #ffd195;
  stroke-dasharray: 5 7;
  stroke-width: 2;
  animation: login-engine-flow 1.55s linear infinite;
}

.login-engine-graphic__combustion-flow {
  opacity: 0.85;
  stroke-width: 1.4;
}

@keyframes login-engine-flow {
  to { stroke-dashoffset: -24; }
}

@media (prefers-reduced-motion: reduce) {
  .login-engine-graphic__hot-gas-flow,
  .login-engine-graphic__combustion-flow {
    animation: none;
  }
}
</style>
