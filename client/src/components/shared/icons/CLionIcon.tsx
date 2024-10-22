import SvgIcon from '@mui/material/SvgIcon'

export default function CLionIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg
        {...props}
        className={`${props.className} no-override-fill`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fill="none"
        viewBox="0 0 96 96"
      >
        <linearGradient
          id="clion-a"
          gradientUnits="userSpaceOnUse"
          x1="34.5098"
          x2="62.0098"
          y1="18.77"
          y2="18.77"
        >
          <stop offset="0" stopColor="#ff318c" />
          <stop offset=".15" stopColor="#fb338b" />
          <stop offset=".28" stopColor="#f03b8b" />
          <stop offset=".42" stopColor="#dd498b" />
          <stop offset=".54" stopColor="#c35d8b" />
          <stop offset=".67" stopColor="#a1768a" />
          <stop offset=".79" stopColor="#78958a" />
          <stop offset=".91" stopColor="#48b989" />
          <stop offset="1" stopColor="#21d789" />
        </linearGradient>
        <linearGradient id="clion-b">
          <stop offset=".09" stopColor="#21d789" />
          <stop offset=".9" stopColor="#009ae5" />
        </linearGradient>
        <linearGradient
          id="clion-c"
          gradientUnits="userSpaceOnUse"
          x1="23.49"
          x2="9.37"
          xlinkHref="#clion-b"
          y1="12.18"
          y2="106.92"
        />
        <linearGradient
          id="clion-d"
          gradientUnits="userSpaceOnUse"
          x1="87.55"
          x2="-9.02998"
          xlinkHref="#clion-b"
          y1="8.90004"
          y2="110.9"
        />
        <linearGradient
          id="clion-e"
          gradientUnits="userSpaceOnUse"
          x1="58.3398"
          x2="91.3698"
          xlinkHref="#clion-b"
          y1="72.52"
          y2="77.22"
        />
        <path d="m34.5098 37.54 2.08-37.54 21.83 12.1z" fill="url(#clion-a)" />
        <path
          d="m34.51 37.54 2.08-37.54-27.72 17.47-8.87 53.11z"
          fill="url(#clion-c)"
        />
        <path
          d="m94.09 28.77-12.35-25.10997-23.32 8.43997-23.91 25.44-34.51 33.04 31.13 22.66 39.13-35.29z"
          fill="url(#clion-d)"
        />
        <path
          d="m77.9998 55.04v22.96h-37.7l16.57 12.82 24 5.18 15.13-34.25z"
          fill="url(#clion-e)"
        />
        <path d="m78 18h-60v60h60z" fill="#000" />
        <path
          d="m26 70h24v-4h-24zm28.3-25.97v-18.54h-4.26v22.4h14.93v-3.86zm-23.73 2.72c1.74 1.01 3.67 1.51 5.81 1.51 1.81 0 3.47-.33 4.98-1s2.77-1.6 3.77-2.81 1.68-2.59 2.03-4.16h-4.5c-.3.83-.75 1.55-1.34 2.17-.6.61-1.32 1.09-2.16 1.42-.84.34-1.76.5-2.75.5-1.33 0-2.54-.33-3.62-1s-1.92-1.58-2.54-2.75c-.61-1.17-.92-2.49-.92-3.96s.31-2.79.92-3.96 1.46-2.08 2.54-2.75 2.28-1 3.62-1c.99 0 1.91.17 2.75.5.84.34 1.56.81 2.16 1.42s1.05 1.34 1.34 2.17h4.5c-.35-1.57-1.03-2.95-2.03-4.16s-2.26-2.14-3.77-2.81-3.17-1-4.98-1c-2.13 0-4.07.5-5.81 1.51s-3.1 2.39-4.1 4.16c-.99 1.77-1.49 3.74-1.49 5.91s.5 4.15 1.49 5.91c.99 1.77 2.36 3.15 4.1 4.16z"
          fill="#fff"
        />
      </svg>
    </SvgIcon>
  )
}
