import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Leaf, Calendar, MapPin, Ruler, Palette, Wheat, Globe } from 'lucide-react';

// Placeholder image URLs (replace with actual image URLs in production)
const sindhriImage1 = '/sindhri4.png';
const sindhriImage2 = '/sindhri2.png';
const sindhriImage3 = '/sindhri3.png';
const sindhriImage4 = '/sindhri1.png';

const langraImage1 = '/langra1.png';
const langraImage2 = '/langra2.png';
const langraImage3 = '/langra3.png';
const langraImage4 = '/langra4.png';


const chaunsaImage1 = '/chaunsa1.png';
const chaunsaImage2 = '/chaunsa2.png';
const chaunsaImage3 = '/chaunsa3.png';
const chaunsaImage4 = '/chaunsa4.png';

const More = () => {
  const { mangoData } = useContext(AppContext);
  const { type } = mangoData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        

        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full text-center">
  <p className="text-[2rem] font-medium text-gray-700">
    <span className="text-amber-600 font-bold">{type}</span>
  </p>
</div>

          </div>

          {type.toLowerCase() === 'sindhri' && (
            <div className="bg-amber-50 rounded-xl p-6 transition-all duration-300 hover:bg-amber-100">
              <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                <Leaf className="w-6 h-6 mr-2" /> About Sindhri Mango
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Sindhri mango, also known as Sindhi mango, is prized for its sweet flavor and juicy pulp. It is one of the most popular mango varieties grown in the Sindh region of Pakistan, considered one of the finest mangoes in the world.
              </p>
              <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
                <img src={sindhriImage3} alt="Sindhri Mango" className="h-34 object-cover rounded-lg ml-6" />
                <img src={sindhriImage4} alt="Sindhri Mango" className="h-34 object-cover rounded-lg " />
              <img src={sindhriImage1} alt="Sindhri Mango" className="w-full object-cover rounded-lg mt-[-49px] ml-[-34px] " />
                <img src={sindhriImage2} alt="Sindhri Mango" className="w-40 object-cover rounded-lg m-0  " />
              </div>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <MapPin className="w-12 h-5 text-amber-500 mr-2 mt-1" />
                  <span><strong>Region:</strong> Sindhri mangoes are predominantly cultivated in the Sindh province of Pakistan, particularly in the districts of Hyderabad, Mirpur Khas, and Tando Allahyar. This variety thrives in the hot and arid climate of the region.</span>
                </li>
                
                <li className="flex items-start">
                  <Wheat className="w-12 h-5 text-amber-500 mr-2 mt-1" />
                  <span><strong>Harvesting:</strong> Sindhri mangoes are typically harvested from late May to June, depending on the specific region and weather conditions. The fruits are hand-picked when they are fully mature, exhibiting a rich golden-yellow color with a sweet aroma.</span>
                </li>
                <li className="flex items-start">
                  <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
                  <span><strong>Size:</strong> Large size, usually measuring around 6 to 8 inches in length.</span>
                </li>
                <li className="flex items-start">
                  <Palette className="w-5 h-5 text-amber-500 mr-2 mt-1" />
                  <span><strong>Color:</strong> Thin, smooth skin that turns from green to deep yellow as it ripens.</span>
                </li>
                <li className="flex items-start">
                  <Globe className="w-12 h-5 text-amber-500 mr-2 mt-1" />
                  <span><strong>Exports:</strong> Sindhri mangoes have gained international recognition and are exported to various countries, including the United States, Canada, Europe, the Middle East, and Asia. They are known for their exquisite flavor and are in high demand in the global market.</span>
                </li>
              </ul>
            </div>
          )}

          
          {type.toLowerCase() === 'langra' && (
  <div className="bg-amber-50 rounded-xl p-6 transition-all duration-300 hover:bg-amber-100">
    <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
      <Leaf className="w-6 h-6 mr-2" /> About Langra Mango
    </h3>
    <p className="text-gray-700 leading-relaxed">
      Langra is a popular variety of mango hailing from Pakistan, known for its distinctively sweet and citrusy flavor. It is highly regarded for its juicy pulp and is considered one of the finest mango types in the country.
    </p>
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <img src={langraImage1} alt="Langra Mango" className="h-40" />
      <img src={langraImage2} alt="Langra Mango" className="h-42 ml-[-10px]" />
      <img src={langraImage3} alt="Langra Mango" className="h-30 mt-[30px] ml-[-20px]" />
      <img src={langraImage4} alt="Langra Mango" className="w-32 mt-[30px]" />
    </div>
    <ul className="mt-4 space-y-3">
      <li className="flex items-start">
        <MapPin className="w-12 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Region:</strong> Langra mangoes are primarily cultivated in the Punjab region of Pakistan, particularly in the districts of Multan, Sahiwal, and Muzaffargarh. This variety is also grown in other parts of Pakistan, including Sindh and Khyber Pakhtunkhwa.</span>
      </li>
      <li className="flex items-start">
        <Calendar className="w-12 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Season:</strong> Available from June to August, with peak harvest in July.</span>
      </li>
      <li className="flex items-start">
        <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Size:</strong> Medium to large in size, usually measuring around 6 to 10 inches in length.</span>
      </li>
      <li className="flex items-start">
        <Palette className="w-5 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Color:</strong> Greenish in color, even when ripe, with dark yellow, fiber-less flesh.</span>
      </li>
      <li className="flex items-start">
        <Globe className="w-12 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Export:</strong> Langra mangoes have gained popularity globally and are exported to various countries, including the United States, Canada, Europe, the Middle East, and East Asia. They are highly valued for their exceptional taste and quality.</span>
      </li>
    </ul>
  </div>
)}

{type.toLowerCase() === 'chaunsa' && (
  <div className="bg-amber-50 rounded-xl p-6 transition-all duration-300 hover:bg-amber-100">
    <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
      <Leaf className="w-6 h-6 mr-2" /> About Chaunsa Mango
    </h3>
    <p className="text-gray-700 leading-relaxed">
      Chaunsa mango is highly regarded for its honey-like sweetness, aromatic and juicy flavor. Pakistani Chaunsa is one of the most popular and unique mango varieties grown in South Asia, often considered a premium mango variety.
    </p>
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  <img src={chaunsaImage1} alt="Chaunsa Mango" className="w-46 object-contain mt-[-40px] rounded-md" />
  <img src={chaunsaImage2} alt="Chaunsa Mango" className="w-46  object-contain rounded-md ml-[-20px]" />
  <img src={chaunsaImage3} alt="Chaunsa Mango" className="h-42  rounded-md ml-[-20px]" />
  <img src={chaunsaImage4} alt="Chaunsa Mango" className=" h-48 mt-[-28px] rounded-md" />
</div>

    <ul className="mt-4 space-y-3">
      <li className="flex items-start">
        <MapPin className="w-12 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Region:</strong>  Chaunsa mangoes are primarily cultivated in the Punjab region of Pakistan, particularly in the Multan and Rahim Yar Khan districts. The favorable climate and fertile soil in these areas contribute to the abundant production of Kala Chaunsa mangoes.</span>
      </li>
      <li className="flex items-start">
        <Calendar className="w-12 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Season:</strong> The harvesting season for  Chaunsa mangoes typically begins in July and continues until August. The mangoes are carefully hand-picked when they reach their peak maturity, ensuring their optimal taste, texture, and aroma.</span>
      </li>
      <li className="flex items-start">
        <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Shape:</strong> Oblong or ovate shape, with a slight curve and a distinct beak-like tip.</span>
      </li>
      
      <li className="flex items-start">
        <Palette className="w-12 h-5 text-amber-500 ml-[-6px] mt-1" />
        <span><strong>Color:</strong> Thin, smooth skin that turns from green to yellow when ripened, with small patches of golden or orange blush when fully ripe.</span>
      </li>
      <li className="flex items-start">
        <Globe className="w-12 h-5 text-amber-500 mr-2 mt-1" />
        <span><strong>Export:</strong> Chaunsa mangoes have gained international recognition for their exceptional flavor and quality. They are exported to various countries, including the United Kingdom, United States, Canada, Middle Eastern nations, and other Asian markets.</span>
      </li>
    </ul>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default More;

// import React, { useContext } from 'react';
// import { AppContext } from '../../context/AppContext';
// import { Leaf, Calendar, MapPin, Ruler, Palette } from 'lucide-react';

// // Placeholder image URLs (replace with actual image URLs in production)
// const sindhriImage1 = '/sindhri1.png';
// const langraImage = 'https://via.placeholder.com/300x200.png?text=Langra+Mango';
// const chaunsaImage = 'https://via.placeholder.com/300x200.png?text=Chaunsa+Mango';
// const defaultImage = 'https://via.placeholder.com/300x200.png?text=Mango';

// const More = () => {
//   const { mangoData } = useContext(AppContext);
//   const { type, status } = mangoData;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
//             Mango Details
//           </h2>
//           <p className="mt-2 text-lg text-gray-600">
//             Discover the unique characteristics of your selected mango
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-lg font-medium text-gray-700">
//                 Mango Type: <span className="text-amber-600 font-bold">{type}</span>
//               </p>
//               <p className="text-lg font-medium text-gray-700">
//                 Status: <span className="text-amber-600 font-bold">{status}</span>
//               </p>
//             </div>
//             <Leaf className="w-12 h-12 text-amber-500 opacity-75" />
//           </div>

//           {type.toLowerCase() === 'sindhri' && (
//             <div className="bg-amber-50 rounded-xl p-6 transition-all duration-300 hover:bg-amber-100">
//               <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
//                 <Leaf className="w-6 h-6 mr-2" /> About Sindhri Mango
//               </h3>
//               <p className="text-gray-700 leading-relaxed">
//                 Sindhri mango, also known as Sindhi mango, is prized for its sweet flavor and juicy pulp. It is one of the most popular mango varieties grown in the Sindh region of Pakistan, considered one of the finest mangoes in the world.
              
//               </p>
//               <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 <img src={sindhriImage1} alt="Sindhri Mango" className="w-42  object-cover rounded-lg shadow-md" />
//                 <img src={sindhriImage1} alt="sindhri Mango" className="w-42 object-cover rounded-lg shadow-md opacity-50" />
//                 <img src={sindhriImage1} alt="sindhri Mango" className="w-42 object-cover rounded-lg shadow-md opacity-50" />
//                 <img src={sindhriImage1} alt="sindhri Mango" className="w-42 object-cover rounded-lg shadow-md opacity-50" />
//               </div>
//               <ul className="mt-4 space-y-3">
//                 <li className="flex items-start">
//                   <MapPin className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Region:</strong> Sindhri mangoes are predominantly cultivated in the Sindh province of Pakistan, particularly in the districts of Hyderabad, Mirpur Khas, and Tando Allahyar. This variety thrives in the hot and arid climate of the region.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Calendar className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Season:</strong>
//                   Sindhri mangoes are typically harvested from late May to June, depending on the specific region and weather conditions. The fruits are hand-picked when they are fully mature, exhibiting a rich golden-yellow color with a sweet aroma.
//                   </span>
//                 </li>
//                 <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Harvesting:</strong> Sindhri mangoes are typically harvested from late May to June, depending on the specific region and weather conditions. The fruits are hand-picked when they are fully mature, exhibiting a rich golden-yellow color with a sweet aroma.</span>
//                 </li>

//                  <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Size:</strong> Large size, usually measuring around 6 to 8 inches in length.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Palette className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Color:</strong> Thin, smooth skin that turns from green to deep yellow as it ripens.</span>
//                 </li>
//                  <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Exports:</strong> Sindhri mangoes have gained international recognition and are exported to various countries, including the United States, Canada, Europe, the Middle East, and Asia. They are known for their exquisite flavor and are in high demand in the global market.</span>
//                 </li>

               


               
//               </ul>
//             </div>
//           )}

//           {type.toLowerCase() === 'langra' && (
//             <div className="bg-amber-50 rounded-xl p-6 transition-all duration-300 hover:bg-amber-100">
//               <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
//                 <Leaf className="w-6 h-6 mr-2" /> About Langra Mango
//               </h3>
//               <p className="text-gray-700 leading-relaxed">
//                 Langra mangoes are a popular variety in Pakistan for their distinctive sweet and citrusy flavor.
//               </p>
//               <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 <img src={sindhriImage} alt="Sindhri Mango" className="w-full h-32 object-cover rounded-lg shadow-md opacity-50" />
//                 <img src={langraImage} alt="Langra Mango" className="w-full h-32 object-cover rounded-lg shadow-md" />
//                 <img src={chaunsaImage} alt="Chaunsa Mango" className="w-full h-32 object-cover rounded-lg shadow-md opacity-50" />
//                 <img src={defaultImage} alt="Default Mango" className="w-full h-32 object-cover rounded-lg shadow-md opacity-50" />
//               </div>
//               <ul className="mt-4 space-y-3">
//                 <li className="flex items-start">
//                   <MapPin className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Region:</strong> Cultivated in Southern Punjab and Multan.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Calendar className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Season:</strong> Harvested from May to July.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Shape:</strong> Distinctive fat oval shape.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Size:</strong> Medium to large in size, usually measuring around 6 to 10 inches in length.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Palette className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Color:</strong> Greenish in color, even when ripe, with dark yellow, fiber-less flesh.</span>
//                 </li>
//               </ul>
//             </div>
//           )}

//           {type.toLowerCase() === 'chaunsa' && (
//             <div className="bg-amber-50 rounded-xl p-6 transition-all duration-300 hover:bg-amber-100">
//               <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
//                 <Leaf className="w-6 h-6 mr-2" /> About Chausa Mango
//               </h3>
//               <p className="text-gray-700 leading-relaxed">
//                 Chaunsa mango is highly regarded for its honey-like sweetness, aromatic and juicy flavor. Pakistani Chaunsa is one of the most popular and unique mango varieties grown in South Asia, often considered a premium mango variety.
//               </p>
//               <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 <img src={sindhriImage} alt="Sindhri Mango" className="w-full h-32 object-cover rounded-lg shadow-md opacity-50" />
//                 <img src={langraImage} alt="Langra Mango" className="w-full h-32 object-cover rounded-lg shadow-md opacity-50" />
//                 <img src={chaunsaImage} alt="Chaunsa Mango" className="w-full h-32 object-cover rounded-lg shadow-md" />
//                 <img src={defaultImage} alt="Default Mango" className="w-full h-32 object-cover rounded-lg shadow-md opacity-50" />
//               </div>
//               <ul className="mt-4 space-y-3">
//                 <li className="flex items-start">
//                   <MapPin className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Region:</strong> Cultivated in Rahim Yar Khan and Multan.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Calendar className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Season:</strong> Harvested from mid-June to mid-August.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Shape:</strong> Oblong or ovate shape, with a slight curve and a distinct beak-like tip.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Ruler className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Size:</strong> Medium to large size, usually measuring around 4 to 6 inches in length.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <Palette className="w-5 h-5 text-amber-500 mr-2 mt-1" />
//                   <span><strong>Color:</strong> Thin, smooth skin that turns from green to yellow when ripens, with small patches of golden or orange blush when fully ripe.</span>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default More;