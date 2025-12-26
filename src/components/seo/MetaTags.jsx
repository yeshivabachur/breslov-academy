import React, { useEffect } from 'react';

export default function MetaTags({ title, description, image, url }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Breslov Academy`;
    }

    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    metaTags.forEach(tag => {
      if (tag.content) {
        let element = document.querySelector(
          tag.property 
            ? `meta[property="${tag.property}"]` 
            : `meta[name="${tag.name}"]`
        );
        
        if (!element) {
          element = document.createElement('meta');
          if (tag.property) {
            element.setAttribute('property', tag.property);
          } else {
            element.setAttribute('name', tag.name);
          }
          document.head.appendChild(element);
        }
        
        element.setAttribute('content', tag.content);
      }
    });
  }, [title, description, image, url]);

  return null;
}