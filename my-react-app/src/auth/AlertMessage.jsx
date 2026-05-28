export default function AlertMessage({ alert }) {
  if (!alert) return null;

  return (
    <div className={`alert ${alert.type}`}>
      {typeof alert.msg === 'string' ? alert.msg : "something went wrong..."}
    </div>
  );
}