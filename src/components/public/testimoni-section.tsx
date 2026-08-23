"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { getFeaturedTestimonials } from "@/lib/firestore/testimonials";
import { Testimonial } from "@/types/testimonial";

interface TestimoniSectionProps {
  title?: string;
}

export function TestimoniSection({ title = "Apa Kata Pelanggan Kami" }: TestimoniSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFeaturedTestimonials(6);
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dengarkan langsung dari pelanggan yang sudah merasakan manfaat mesin
            es kristal kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              <p className="text-gray-700 mb-4 line-clamp-4 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.customerName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.customerName}
                  </p>
                  {testimonial.location && (
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  )}
                </div>
              </div>

              {testimonial.productUsed && (
                <p className="text-xs text-gray-500 mt-2">
                  Produk: {testimonial.productUsed}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
