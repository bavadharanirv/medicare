import { memo } from "react";

function DoctorCard({doctor,onSelect}){
return(
<article className="doctor-card">
<div className="doctor-image" aria-hidden="true">
👨‍⚕️</div>
<div className="doctor-info">
<h2>{doctor.name}</h2>
<p className="specialty">
{doctor.specialty}
</p><p>
⭐ {doctor.rating}
</p><p>
Experience: {doctor.experience} years
</p><p>
Hospital: {doctor.hospital}
</p>
<p>
Consultation Fee: ₹{doctor.fee}
</p>
<p className={
doctor.available
?"available"
:"unavailable"
}>
{doctor.available
?"Available"
:"Not Available"}
</p><button
className="view-profile-btn"
disabled={!doctor.available}
onClick={() => onSelect(doctor)} aria-label={`View profile for ${doctor.name}`}
>View Profile</button>
</div></article>
);} 
export default memo(DoctorCard);
