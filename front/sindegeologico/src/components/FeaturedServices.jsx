import React from 'react';

export default function FeaturedServices() {
  const items = [
    { icon: 'bi-brush', title: 'Creative Design', text: 'Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu.' },
    { icon: 'bi-globe', title: 'Web Development', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' },
    { icon: 'bi-graph-up-arrow', title: 'Digital Marketing', text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.' },
    { icon: 'bi-headset', title: 'Consulting', text: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim.' }
  ];

  return (
    <section id="featured-services" className="featured-services section py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          {items.map((item, i) => (
            <div className="col-lg-3 col-md-6" key={i}>
              <div className="service-item p-4 bg-white border rounded h-100 shadow-sm">
                <div className="service-icon mb-3" style={{ fontSize: '2rem', color: '#069169' }}><i className={`bi ${item.icon}`}></i></div>
                <h3>{item.title}</h3>
                <p className="text-muted small">{item.text}</p>
                <a href="service-details.html" className="service-link text-decoration-none fw-bold" style={{ color: '#069169' }}>
                  <span>Explore Service</span> <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}