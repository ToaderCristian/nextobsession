export default function Bottle({ tint = "#E9C9BD", w = 58, h = 86 }) {
  return (
    <svg aria-hidden="true" width={w} height={h} viewBox="0 0 34 50" fill="none">
      <rect x="11" y="1" width="12" height="9" fill="#BFA36A" />
      <rect x="14" y="10" width="6" height="4" fill="#9C8550" />
      <rect x="2" y="14" width="30" height="35" rx="3" fill={tint} stroke="#111" strokeOpacity=".12" />
      <rect x="9" y="23" width="16" height="15" fill="#fff" fillOpacity=".85" />
    </svg>
  );
}
