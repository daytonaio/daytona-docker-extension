import SvgIcon from '@mui/material/SvgIcon'

export default function WebStormIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg
        {...props}
        className={`${props.className} no-override-fill`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="4.5 4.5 96 96"
      >
        <linearGradient
          id="webstorm-a"
          gradientUnits="userSpaceOnUse"
          x1="38.88"
          x2="63.72"
          y1="6.5"
          y2="95.94"
        >
          <stop offset=".28" stopColor="#07c3f2" />
          <stop offset=".94" stopColor="#087cfa" />
        </linearGradient>
        <linearGradient
          id="webstorm-b"
          gradientUnits="userSpaceOnUse"
          x1="46.63"
          x2="88.66"
          y1="17.85"
          y2="79.48"
        >
          <stop offset=".14" stopColor="#fcf84a" />
          <stop offset=".37" stopColor="#07c3f2" />
        </linearGradient>
        <linearGradient
          id="webstorm-c"
          x1="88.27"
          x2="93.79"
          xlinkHref="#webstorm-a"
          y1="25.47"
          y2="45.02"
        />
        <path
          d="m17.44 91.26-12.94-76.7 23.93-9.93 15.28 9.08 14-7.55 29.17 11.2-16.36 83.14z"
          fill="url(#webstorm-a)"
        />
        <path
          d="m100.5 37.01-12.39-30.6-22.48-1.91-34.7 33.34 9.34 42.97 17.44 12.23 42.79-25.39-10.5-19.69z"
          fill="url(#webstorm-b)"
        />
        <path
          d="m81.27 32.45 8.73 15.51 10.5-10.95-7.71-19.06z"
          fill="url(#webstorm-c)"
        />
        <path d="m22.5 22.5h60v60h-60z" />
        <g fill="#fff">
          <path d="m29.98 71.16h22.5v3.75h-22.5z" />
          <path d="m51.28 29.97-3.35 13.13-3.83-13.13h-3.81l-3.84 13.13-3.34-13.13h-5.25l6.43 22.51h4.22l3.68-13.03 3.64 13.03h4.27l6.42-22.51z" />
          <path d="m57.46 49.27 2.93-3.51a10.34 10.34 0 0 0 6.74 2.74c2 0 3.26-.8 3.26-2.13v-.06c0-1.26-.78-1.9-4.55-2.87-4.55-1.16-7.48-2.42-7.48-6.9v-.07c0-4.09 3.29-6.8 7.9-6.8a13 13 0 0 1 8.38 2.87l-2.58 3.74a10.54 10.54 0 0 0 -5.87-2.22c-1.9 0-2.9.87-2.9 2v.07c0 1.48 1 2 4.87 3 4.58 1.2 7.16 2.84 7.16 6.78v.06c0 4.48-3.42 7-8.29 7a14.34 14.34 0 0 1 -9.57-3.61" />
        </g>
      </svg>
    </SvgIcon>
  )
}
