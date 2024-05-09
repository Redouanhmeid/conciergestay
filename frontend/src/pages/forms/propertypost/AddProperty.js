import React, { useState } from 'react';
import Step1NameAddresse from './Step1NameAddresse';
import Step2CheckInOut from './Step2CheckInOut';
import Step3Equipements from './Step3Equipements';
import Step4Photos from './Step4Photos';
import Step5HouseManual from './Step5HouseManual';

const AddProperty = () => {
 //state for steps
 const [current, setCurrent] = useState(1);
 //state for form data
 const [formData, setFormData] = useState({});
 // function for going to next step by increasing current state by 1
 const next = () => {
  setCurrent(current + 1);
 };
 // function for going to previous step by decreasing current state by 1
 const prev = () => {
  setCurrent(current - 1);
 };
 // handling form input data by taking onchange value and updating our previous form data state
 const handleInputData = (input) => (e) => {
  // input value from the form
  const { value } = e.target;

  //updating for data state taking previous state and then adding new value to create new object
  setFormData((prevData) => ({
   ...prevData,
   [input]: value,
  }));
 };

 switch (current) {
  // Name Adrresse & Map Picker
  case 1:
   return (
    <Step1NameAddresse
     next={next}
     handleFormData={handleInputData}
     values={formData}
    />
   );
  // CheckIn and ChekOut
  case 2:
   return <Step2CheckInOut next={next} prev={prev} values={formData} />;
  // Equipments
  case 3:
   return <Step3Equipements next={next} prev={prev} values={formData} />;
  // Photos
  case 4:
   return <Step4Photos next={next} prev={prev} values={formData} />;
  // HouseManual
  case 5:
   return <Step5HouseManual prev={prev} values={formData} />;
  default:
   return null;
 }
};

export default AddProperty;
