export default function SectionTitle({
  title,
  description,
}: {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
}) {
  const titleElement =
    typeof title === 'string' ? (
      <h3 className='text-primary-brand mt-2 text-4xl sm:text-5xl text-vintage-wine text-center'>
        {title.toUpperCase()}
      </h3>
    ) : (
      <div className='text-primary-brand mt-2 text-4xl sm:text-5xl text-vintage-wine text-center'>
        {title}
      </div>
    );
  const descriptionElement =
    typeof description === 'string' ? (
      <p className='text-primary-descriptor mt-4 leading-8 text-vintage-wine text-center'>
        {description.toUpperCase()}
      </p>
    ) : description ? (
      <div className='text-primary-descriptor mt-4 leading-8 text-vintage-wine text-center'>
        {description}
      </div>
    ) : null;

  return (
    <div className='mx-auto max-w-2xl text-center mb-8'>
      {titleElement}
      {descriptionElement}
    </div>
  );
}
