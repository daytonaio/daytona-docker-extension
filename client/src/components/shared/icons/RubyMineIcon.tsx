import SvgIcon from '@mui/material/SvgIcon'

export default function RubyMineIcon(props: any) {
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
          id="rubymine-a"
          gradientUnits="userSpaceOnUse"
          x1="61.4"
          x2="49.27"
          y1="55.58"
          y2="23.74"
        >
          <stop offset="0" stopColor="#fe2857" />
          <stop offset=".06" stopColor="#fd3051" />
          <stop offset=".33" stopColor="#fd523a" />
          <stop offset=".58" stopColor="#fc6b2a" />
          <stop offset=".81" stopColor="#fc7a20" />
          <stop offset="1" stopColor="#fc801d" />
        </linearGradient>
        <linearGradient
          id="rubymine-b"
          gradientUnits="userSpaceOnUse"
          x1="37.7098"
          x2="56.3298"
          y1="10.2301"
          y2="27.3001"
        >
          <stop offset="0" stopColor="#6b57ff" />
          <stop offset="1" stopColor="#fe2857" />
        </linearGradient>
        <linearGradient
          id="rubymine-c"
          gradientUnits="userSpaceOnUse"
          x1=".039999"
          x2="61.4799"
          y1="15.6801"
          y2="93.7701"
        >
          <stop offset="0" stopColor="#6b57ff" />
          <stop offset=".3" stopColor="#fe2857" />
          <stop offset=".63" stopColor="#fe2857" />
          <stop offset=".64" stopColor="#fd3051" />
          <stop offset=".7" stopColor="#fd523a" />
          <stop offset=".76" stopColor="#fc6b2a" />
          <stop offset=".81" stopColor="#fc7a20" />
          <stop offset=".85" stopColor="#fc801d" />
        </linearGradient>
        <path
          d="m79.84 0-27.48 9.83984-21.64-9.83984-7.13 17.96-4.84.04v53.25l66.9.3101 10.35-52.8003z"
          fill="url(#rubymine-a)"
        />
        <path
          d="m77.9998 34.4502-43.2-26.08008 43.2 51.49998z"
          fill="url(#rubymine-b)"
        />
        <path
          d="m39.57 93.5 35.53-4.7798-5.51-10.7104h8.41v-18.1397l-43.2-51.49998-34.8 8.62988.03 50.3999 20.01 28.6001 19.42-2.4902.1-.0098z"
          fill="url(#rubymine-c)"
        />
        <path d="m78 18h-60v60h60z" fill="#000" />
        <path
          d="m26 70h24v-4h-24zm37.41-44.52-5.17 8.75-.46 1.06-.5-1.06-5.42-8.75h-4.88v22.3999h4.21v-15.8701l-.06-.8296 6.54 10.4497 6.56-10.5401-.05.9302v15.8701h4.19v-22.3999h-4.96zm-32.93 13.8901h3.87l4.87 8.5098h4.9l-5.34-8.96c.38-.12.75-.2599 1.1-.4199 1.2-.58 2.13-1.4 2.78-2.46.66-1.06.98-2.2801.98-3.6601s-.32-2.5701-.97-3.6201c-.65-1.04-1.56-1.85-2.74-2.42s-2.56-.8598-4.11-.8598h-9.6v22.3999h4.27v-8.5098zm0-10.3203h5.04c.75 0 1.4.1402 1.96.4102s.99.6599 1.29 1.1699.45 1.1003.45 1.7803-.15 1.2898-.45 1.7998-.73.9001-1.29 1.1801-1.21.42-1.96.42h-5.04v-6.75z"
          fill="#fff"
        />
      </svg>
    </SvgIcon>
  )
}
