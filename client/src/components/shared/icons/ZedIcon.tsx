import SvgIcon from '@mui/material/SvgIcon'

export default function ZedIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="white"
        viewBox="0 0 1024 1024"
      >
        <path
          fill-rule="evenodd"
          d="M96 64c-17.673 0-32 14.327-32 32v704H0V96C0 42.98 42.98 0 96 0h857.373c42.763 0 64.177 51.703 33.941 81.941L459.255 610H608v-66h64v82c0 26.51-21.49 48-48 48H395.255l-110 110H784V384h64v400c0 35.346-28.654 64-64 64H221.255l-112 112H928c17.673 0 32-14.327 32-32V224h64v704c0 53.019-42.981 96-96 96H70.627c-42.763 0-64.179-51.703-33.94-81.941L562.744 416H416v64h-64v-80c0-26.51 21.49-48 48-48h226.745l112-112H240v400h-64V240c0-35.346 28.654-64 64-64h562.745l112-112z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </SvgIcon>
  )
}