import CategoryBar from './CategoryBar';
import TagBar from './TagBar';

interface BlogHeaderProps {
  title: string;
  description?: string;
  categories: string[];
  tags: string[];
}

export default function BlogHeader({
  title,
  description,
  categories,
  tags,
}: BlogHeaderProps) {
  return (
    <div>
      <div className="py-12 pt-28">
        <div className="mb-6 text-center">
          <span className="inline-block rounded-lg bg-primary/10 px-4 py-1.5 text-lg font-medium text-primary">
            Sealos Blog
          </span>
        </div>
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        {description && (
          <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
            <p className="text-center text-lg text-muted-foreground">
              {description}
            </p>
          </div>
        )}
      </div>
      <CategoryBar categories={categories} />
      <div className="hidden sm:block">
        <TagBar tags={tags} />
      </div>
    </div>
  );
}
