
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    service: 'Hair Styling',
    rating: 5,
    content: 'Absolutely amazing experience! The staff was professional and the results exceeded my expectations. My hair has never looked better!',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Emily Chen',
    service: 'Spa Package',
    rating: 5,
    content: 'The spa package was pure luxury. From the moment I walked in, I felt pampered and relaxed. The attention to detail is incredible.',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Jessica Martinez',
    service: 'Facial Treatment',
    rating: 5,
    content: 'My skin is glowing after the facial treatment! The esthetician was knowledgeable and the environment was so peaceful and clean.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 4,
    name: 'Amanda Rodriguez',
    service: 'Hair Coloring',
    rating: 5,
    content: 'Perfect color match! The stylist really listened to what I wanted and delivered exactly that. The salon atmosphere is so welcoming.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-salon-pink-light to-salon-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from our satisfied clients about their experiences.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 md:p-12">
                      <div className="text-center">
                        <Quote className="h-12 w-12 text-salon-gold mx-auto mb-6 opacity-60" />
                        
                        <p className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center justify-center space-x-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-salon-pink"
                          />
                          <div className="text-left">
                            <div className="font-semibold text-lg text-gray-800">
                              {testimonial.name}
                            </div>
                            <div className="text-salon-gold font-medium">
                              {testimonial.service}
                            </div>
                            <div className="flex items-center mt-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-salon-gold fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-salon-gold' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
