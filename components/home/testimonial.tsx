import { testimonies } from "@/utils";
import { Star } from "lucide-react";

export const Testimonial = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">What our users say</h2>
          <p className="mt-4 text-muted-foreground">
            See how TM-iitimu has transformed the way teams work. Hear directly
            from users who've improved their productivity and project management
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonies.map((item) => (
            <div
              key={item?.id}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl"
            >
              <div className="flex items-start mb-6">
                {Array.from({ length: item.rating }, (_, index) => (
                  <Star key={index} className="h-6 w-6 text-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 line-clamp-4">
                {item.review}
              </p>
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
