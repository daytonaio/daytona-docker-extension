import SvgIcon from '@mui/material/SvgIcon'

export default function RiderIcon(props: any) {
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
          id="rider-a"
          gradientUnits="userSpaceOnUse"
          x1="89.8302"
          x2="15.8302"
          y1="55"
          y2="12.53"
        >
          <stop offset="0" stopColor="#dd1265" />
          <stop offset=".48" stopColor="#dd1265" />
          <stop offset=".94" stopColor="#fdb60d" />
        </linearGradient>
        <linearGradient
          id="rider-b"
          gradientUnits="userSpaceOnUse"
          x1="45.8298"
          x2="75.1598"
          y1="8.38002"
          y2="89.38"
        >
          <stop offset=".14" stopColor="#087cfa" />
          <stop offset=".48" stopColor="#dd1265" />
          <stop offset=".96" stopColor="#087cfa" />
        </linearGradient>
        <linearGradient
          id="rider-c"
          gradientUnits="userSpaceOnUse"
          x1="23.86"
          x2="45.52"
          y1="10.88"
          y2="87.8801"
        >
          <stop offset=".28" stopColor="#dd1265" />
          <stop offset=".97" stopColor="#fdb60d" />
        </linearGradient>
        <path
          d="m96.0002 37.3501-67.3-37.3501 45.06 66.96 9.26-6.0701z"
          fill="url(#rider-a)"
        />
        <path
          d="m69.1498 22.1201-8.44-20.60008-18.64 18.35008 7.63 66.6299 18.06 9.5 28.24-16.48z"
          fill="url(#rider-b)"
        />
        <path
          d="m28.7 0-28.7 19.3301 10.67 65.9299 27.52 10.5901 35.57-28.8901z"
          fill="url(#rider-c)"
        />
        <path d="m78 18h-60v60h60z" fill="#000" />
        <path
          d="m26 70h24v-4h-24zm4.47-30.6299h3.87l4.87 8.5098h4.9l-5.34-8.96c.38-.12.75-.2599 1.1-.4199 1.2-.58 2.13-1.4 2.78-2.46.66-1.06.98-2.2801.98-3.6601s-.32-2.5699-.97-3.6199c-.65-1.04-1.56-1.8499-2.74-2.4199s-2.56-.8601-4.11-.8601h-9.6v22.3999h4.27v-8.5098zm0-10.3201h5.04c.75 0 1.4.14 1.96.41s.99.6599 1.29 1.1699.45 1.1.45 1.78-.15 1.2901-.45 1.8001-.73.8999-1.29 1.1799-1.21.4202-1.96.4202h-5.04v-6.75zm34.64 1.8699c-.94-1.7-2.26-3.03-3.94-3.99s-3.58-1.4399-5.69-1.4399h-8.51v22.3999h8.51c2.11 0 4.01-.4799 5.69-1.4399s2.99-2.29 3.94-3.99c.94-1.7 1.42-3.6201 1.42-5.7701s-.47-4.07-1.42-5.77zm-3.79 9.76c-.55 1.13-1.33 1.9901-2.34 2.6001s-2.19.9099-3.54.9099h-4.19v-15.01h4.19c1.34 0 2.52.3002 3.54.9102 1.01.61 1.79 1.4698 2.34 2.5998s.82 2.46.82 3.99-.27 2.87-.82 3.99z"
          fill="#fff"
        />
      </svg>
    </SvgIcon>
  )
}
