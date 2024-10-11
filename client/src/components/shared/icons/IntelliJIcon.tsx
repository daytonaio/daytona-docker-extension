import SvgIcon from '@mui/material/SvgIcon'

export default function IntelliJIcon(props: any) {
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
          id="idea-a"
          gradientUnits="userSpaceOnUse"
          x1="7.10008"
          x2="54.8801"
          y1="54.7099"
          y2="52.2799"
        >
          <stop offset=".09" stopColor="#fc801d" />
          <stop offset=".23" stopColor="#b07e61" />
          <stop offset=".41" stopColor="#567db2" />
          <stop offset=".53" stopColor="#1d7ce6" />
          <stop offset=".59" stopColor="#087cfa" />
        </linearGradient>
        <linearGradient
          id="idea-b"
          gradientUnits="userSpaceOnUse"
          x1="84.98"
          x2="69.05"
          y1="49.6199"
          y2="2.02004"
        >
          <stop offset="0" stopColor="#fe2857" />
          <stop offset=".08" stopColor="#ca3978" />
          <stop offset=".16" stopColor="#9d4896" />
          <stop offset=".25" stopColor="#7556b1" />
          <stop offset=".34" stopColor="#5362c8" />
          <stop offset=".44" stopColor="#376bda" />
          <stop offset=".54" stopColor="#2272e8" />
          <stop offset=".66" stopColor="#1378f2" />
          <stop offset=".79" stopColor="#0a7bf8" />
          <stop offset="1" stopColor="#087cfa" />
        </linearGradient>
        <linearGradient
          id="idea-c"
          gradientUnits="userSpaceOnUse"
          x1="14.65"
          x2="74.7299"
          y1="22.11"
          y2="121.49"
        >
          <stop offset="0" stopColor="#fe2857" />
          <stop offset=".08" stopColor="#fe295f" />
          <stop offset=".21" stopColor="#fe2d76" />
          <stop offset=".3" stopColor="#ff318c" />
          <stop offset=".38" stopColor="#e93795" />
          <stop offset=".55" stopColor="#b148ae" />
          <stop offset=".79" stopColor="#5963d5" />
          <stop offset="1" stopColor="#087cfa" />
        </linearGradient>
        <path
          d="m15.2101 67.71-14.13002-11.1499 8.31-15.3902 12.49002 4.1802z"
          fill="url(#idea-a)"
        />
        <path
          d="m95.9999 25.5901-1.73 55.6099-36.98 14.8-20.14-13z"
          fill="#087cfa"
        />
        <path
          d="m96 25.5901-18.3 17.8498-23.49-28.8298 11.6-13.04003z"
          fill="url(#idea-b)"
        />
        <path
          d="m37.15 83-29.41 10.6299 6.17-21.5698 7.97-26.71-21.88-7.3201 13.91-38.03 31.41 3.69995 32.38 39.73995z"
          fill="url(#idea-c)"
        />
        <path d="m78 18h-60v60h60z" fill="#000" />
        <path
          d="m26 70h24v-4h-24zm20.58-44.52v15.98c0 .49-.1.92-.31 1.3-.21.37-.5.6601-.87.8701s-.81.3098-1.3.3098h-3.73v3.9402h4.24c1.23 0 2.31-.25 3.26-.76s1.68-1.2201 2.2-2.1501.78-2 .78-3.22v-16.27zm-8.15 18.57h-3.18v-14.75h3.18v-3.82h-10.58v3.82h3.2v14.75h-3.2v3.8201h10.58z"
          fill="#fff"
        />
      </svg>
    </SvgIcon>
  )
}
