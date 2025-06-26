
interface OverviewProps {
  title: string;
  columns: React.ReactNode[][]; // Each column contains a list of components
}

export default function OverviewCard({ title, columns }: OverviewProps) {
  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-row gap-4">
            {column.map((component, idx) => (
              <div key={idx} className=" ">
                {component}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}