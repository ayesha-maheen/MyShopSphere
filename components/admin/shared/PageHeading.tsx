type PageHeadingProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export default function PageHeading({
  title,
  description,
  eyebrow = "Administration",
}: PageHeadingProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-[#75619A]">
        {eyebrow}
      </p>

      <h1 className="mt-2 text-3xl font-black text-[#292335] sm:text-4xl">
        {title}
      </h1>

      <p className="mt-2 text-sm text-[#827A8D]">
        {description}
      </p>
    </div>
  );
}