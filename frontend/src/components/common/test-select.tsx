type Option<T> = { label: string; value: T };

type MySelectProps<T extends readonly Option<any>[]> = {
  data: T;
  onClick: (value: T[number]["value"]) => void;
};

export default function TestSelect<T extends readonly Option<any>[]>({
  data,
  onClick,
}: MySelectProps<T>) {
  return (
    <div>
      {data.map((item) => (
        <button key={String(item.value)} onClick={() => onClick(item.value)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
