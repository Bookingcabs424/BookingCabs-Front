const MapComponent = () => {
  const latitude = process.env.NEXT_PUBLIC_COMPANY_LATITUDE;
  const longitude = process.env.NEXT_PUBLIC_COMPANY_LONGITUDE;

  const location = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;

  return (
    <div className="w-full rounded overflow-hidden shadow-md">
      <iframe
        src={location}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapComponent;
