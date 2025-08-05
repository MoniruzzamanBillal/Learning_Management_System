const MapContainer = () => {
  return (
    <div className="MapContainerContainer  ">
      <div className="mapContent  w-full ">
        <iframe
          className="w-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3301.2842957914577!2d90.38808457479618!3d23.88827478347026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c469610d01b9%3A0xaa41c726134f443b!2sIUBAT%20-%20International%20University%20of%20Business%20Agriculture%20and%20Technology!5e1!3m2!1sen!2sbd!4v1754280449121!5m2!1sen!2sbd"
          width="600"
          height="450"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapContainer;
