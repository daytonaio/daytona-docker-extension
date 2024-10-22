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
        <linearGradient id="goland-a">
          <stop offset="0" stopColor="#087cfa" />
          <stop offset=".02" stopColor="#0c7af9" />
          <stop offset=".37" stopColor="#5565f8" />
          <stop offset=".66" stopColor="#8a56f7" />
          <stop offset=".88" stopColor="#aa4df7" />
          <stop offset="1" stopColor="#b74af7" />
        </linearGradient>
        <linearGradient
          id="goland-b"
          gradientUnits="userSpaceOnUse"
          x1="94.5299"
          x2="57.0398"
          xlinkHref="#goland-a"
          y1="54.6799"
          y2="86.4099"
        />
        <linearGradient
          id="goland-c"
          gradientUnits="userSpaceOnUse"
          x1="33.04"
          x2="55.83"
          xlinkHref="#goland-a"
          y1="29.76"
          y2="3.83004"
        />
        <linearGradient
          id="goland-d"
          gradientUnits="userSpaceOnUse"
          x1="13.34"
          x2="82.5901"
          y1="83.86"
          y2="39.36"
        >
          <stop offset="0" stopColor="#087cfa" />
          <stop offset=".1" stopColor="#1598d2" />
          <stop offset=".22" stopColor="#22b5aa" />
          <stop offset=".35" stopColor="#2dcc8a" />
          <stop offset=".46" stopColor="#34dc74" />
          <stop offset=".57" stopColor="#39e666" />
          <stop offset=".67" stopColor="#3bea62" />
        </linearGradient>
        <path
          d="m84.5599 37.1299 11.44 25.4101-19.58 33.46-12.06-29.28 20.21-29.5901z"
          fill="url(#goland-b)"
        />
        <path d="m64.3601 66.72 12.06 29.28-30.34-10.4299z" fill="#b74af7" />
        <path
          d="m67.63 27.1201-6.22-27.1201h-34.49l-26.92 41.1799 7.79 18.9202-7.79 17.27 55.75-47.4402z"
          fill="url(#goland-c)"
        />
        <path
          d="m96 20.3799-40.25 9.55-55.75 47.4402 35.96 18.6299 28.4-29.28z"
          fill="url(#goland-d)"
        />
        <path d="m78 18h-60v60h60z" fill="#000" />
        <path
          d="m25.0001 70h24v-4h-24zm3.89-23.24c1.74 1.01 3.67 1.51 5.81 1.51s3.9-.4601 5.56-1.3701 2.96-2.17 3.91-3.76 1.42-3.3699 1.42-5.3399v-1.76h-9.42v3.3799h5.23c-.1.86-.4 1.6501-.9 2.3501-.59.82-1.39 1.46-2.39 1.93-1 .46-2.13.6999-3.38.6999-1.33 0-2.54-.33-3.62-1s-1.92-1.58-2.54-2.75-.92-2.49-.92-3.96.31-2.7899.92-3.9599 1.46-2.08 2.54-2.75 2.28-1 3.62-1c.91 0 1.75.1399 2.54.4199.78.28 1.47.6902 2.06 1.2102s1.06 1.1399 1.4 1.8599h4.58c-.41-1.45-1.11-2.7301-2.12-3.8401s-2.24-1.9699-3.7-2.5899-3.06-.9299-4.78-.9299c-2.13 0-4.07.5-5.81 1.51s-3.1 2.3999-4.1 4.1599c-.99 1.77-1.49 3.7399-1.49 5.9099s.5 4.1502 1.49 5.9102 2.36 3.1499 4.1 4.1599zm40.03-15.99c-.99-1.76-2.36-3.1499-4.1-4.1599s-3.69-1.51-5.84-1.51-4.08.5-5.82 1.51-3.11 2.3999-4.1 4.1599c-1 1.77-1.5 3.7399-1.5 5.9099s.5 4.1502 1.5 5.9102 2.37 3.1499 4.1 4.1599c1.74 1.01 3.68 1.51 5.82 1.51s4.1-.5 5.84-1.51 3.1-2.3899 4.1-4.1599 1.49-3.7402 1.49-5.9102-.5-4.1499-1.49-5.9099zm-3.8 9.93c-.6 1.19-1.4401 2.13-2.5101 2.8s-2.2699 1.01-3.6099 1.01-2.54-.34-3.61-1.01-1.9101-1.61-2.5301-2.8c-.61-1.2-.9199-2.5301-.9199-4.0201s.3099-2.82.9199-4.02c.61-1.19 1.4601-2.1298 2.5301-2.7998s2.27-1.01 3.61-1.01 2.5399.34 3.6099 1.01 1.9101 1.6098 2.5101 2.7998.9 2.53.9 4.02-.3 2.8201-.9 4.0201z"
          fill="#fff"
        />
      </svg>
    </SvgIcon>
  )
}
