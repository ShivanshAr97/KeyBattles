// 'use client'
// import React, { useEffect, useState } from 'react'

// const page = () => {
//   const paragraphs = () => {

//     const content = "between the vast bustling cityscape and the serene countryside lies a point of convergence a place where the energy of urban life meets the tranquility of nature  here  amidst the cacophony of honking cars and bustling crowds one can find a sense of peace and solace  the city  with its towering skyscrapers and neon lit streets  pulses with the rhythm of progress and ambition  yet just beyond its borders  the landscape transforms into rolling hills and verdant fields  where time seems to slow and the air is filled with the scent of fresh grass and blooming flowers  it is at this intersection of worlds that we find ourselves  caught between the hustle and bustle of modern life and the quiet beauty of the natural world and here perhaps  we can find the balance we seek  as we navigate the complexities of existence and strive to find our place in the world  amidst the swirling chaos of existence  where the boundaries of reality blur and the fabric of time bends  there exists a point of convergence a nexus of infinite possibilities  where the threads of fate intertwine and destinies are forged  here  in the vast expanse of the universe  where galaxies collide and stars are born  we find ourselves suspended in the cosmic dance of creation and destruction  it is at this intersection of space and time that we glimpse the true nature of our existence a fleeting moment of clarity in the endless tapestry of existence  at this nexus  where the forces of light and darkness converge  we are confronted with the eternal struggle between order and chaos  between creation and annihilation  here  in the depths of the human psyche  we grapple with our deepest fears and desires  our hopes and dreams intertwining like tendrils of smoke in the night sky  it is here  amidst the ebb and flow of consciousness  that we confront the mysteries of existence and seek to unravel the enigma of our own existence in this liminal space  where the boundaries between the seen and the unseen blur  we are confronted with the myriad facets of reality the shadows that lurk in the depths of our subconscious  the whispers of forgotten memories that echo through the corridors of our minds  here  in the twilight realm of dreams and nightmares  we confront our innermost demons and embrace the darkness that lies within us all  but amidst the chaos and confusion  there is also beauty and wonder to be found a glimmer of hope that pierces the darkness like a beacon of light in the night sky  it is in the simple moments of connection and compassion that we find solace amidst the storm  reaching out to one another across the vast expanse of space and time to offer comfort and support and so as we navigate the turbulent waters of existence  let us remember that we are not alone that we are all connected by the invisible threads of fate bound together in the eternal tapestry of life  and as we stand at the precipice of the unknown let us embrace the journey that lies ahead  for it is only through facing our fears and embracing the unknown that we can truly discover the beauty and wonder of existence"

//     const words = content.split(" ")
//     const para = []

//     const format = (word: string): string => {
//       return `${word.split('').join('')}`;
//     }

//     for (let i = 0; i < 100; i++) {
//       para.push(format(words[Math.floor(Math.random() * words.length)]))
//     }
//     return para.join(" ")
//   }

//   const funcKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     const key = e.key;

//     const isLetter = key.length === 1 && key != ' '
//     const isBackspace = key === 'backspace'
//     const isSpace = key === ' '

//     for (let i = 0; i < text.length; i++) {
//       console.log(key, text[i]);
//     }
//   }

//   const [text, setText] = useState('')
//   const [typed, setTyped] = useState('')
//   const [font, setFont] = useState('sans')
//   const [timer, setTimer] = useState(15)
//   const [background, setBackground] = useState('gray')

//   useEffect(() => {
//     setText(paragraphs)
//   }, [])

//   // console.log(text[0]);

//   const handleFontChange = (e: any) => {
//     setFont(e.target.value)
//   }

//   const handleBackgroundChange = (e: any) => {
//     setBackground(e.target.value)
//   }

//   return (
//     <div className={background === 'gray' ? 'text-white' : 'text-black' + `text-xs font-${font.toLowerCase()} `}>
//       <div className='flex gap-12 m-8'>
//         <ul className='flex gap-4'>
//           <li className='border px-3 py-1 rounded-md'>Punctuations</li>
//           <li className='border px-3 py-1 rounded-md'>Numbers</li>
//         </ul>
//         <div className=''>
//           <ul className='flex gap-4'>

//             <li onClick={(e) => setTimer(15)} className='font border px-4 py-1 rounded-md'>15</li>
//             <li onClick={(e) => setTimer(30)} className='border px-3 py-1 rounded-md'>30</li>
//             <li onClick={(e) => setTimer(60)} className='border px-3 py-1 rounded-md'>60</li>
//             <li onClick={(e) => setTimer(120)} className='border px-3 py-1 rounded-md'>120</li>
//           </ul>
//         </div>

//         <div className='flex gap-2 items-center align-middle'>
//           <p className='text-base'>Font:</p>

//           <select
//             className='border'
//             name="Font"
//             id="font"
//             value={font}
//             onChange={handleFontChange}
//           >
//             <option value="sans">Sans</option>
//             <option value="serif">Serif</option>
//             <option value="mono">Mono</option>
//           </select>
//         </div>

//         <div className='flex gap-2 items-center align-middle'>
//           <p className='text-base'>Background:</p>
//           <select className='border' name="Background" id="background" value={background} onChange={handleBackgroundChange}>
//             <option value="gray">Gray</option>
//             <option value="white">White</option>
//           </select>

//         </div>

//         {/* time
//         <button>restart</button> */}
//       </div>

//       <div onKeyDown={funcKey} className='border-2 relative m-8'>
//         <div className='leading-[2rem] text-2xl h-[6rem] absolute overflow-hidden'>
//           {text.split('').map((char, index) => (
//             <span key={index} className={index < typed.length ? 'text-green-500' : ''}>
//               {char}
//             </span>
//           ))}
//         </div>
//         <div />
//         <div className='h-[1.5rem] top-1 animate-blink w-0.5 relative bg-red-400'></div>
//       </div>
//     </div>
//   )
// }

// export default page
'use client'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const generateParagraphs = () => {
    const content = "between the vast bustling cityscape and the serene countryside lies a point of convergence a place where the energy of urban life meets the tranquility of nature here amidst the cacophony of honking cars and bustling crowds one can find a sense of peace and solace the city with its towering skyscrapers and neon lit streets pulses with the rhythm of progress and ambition yet just beyond its borders the landscape transforms into rolling hills and verdant fields where time seems to slow and the air is filled with the scent of fresh grass and blooming flowers it is at this intersection of worlds that we find ourselves caught between the hustle and bustle of modern life and the quiet beauty of the natural world and here perhaps we can find the balance we seek as we navigate the complexities of existence and strive to find our place in the world amidst the swirling chaos of existence where the boundaries of reality blur and the fabric of time bends there exists a point of convergence a nexus of infinite possibilities where the threads of fate intertwine and destinies are forged here in the vast expanse of the universe where galaxies collide and stars are born we find ourselves suspended in the cosmic dance of creation and destruction it is at this intersection of space and time that we glimpse the true nature of our existence a fleeting moment of clarity in the endless tapestry of existence at this nexus where the forces of light and darkness converge we are confronted with the eternal struggle between order and chaos between creation and annihilation here in the depths of the human psyche we grapple with our deepest fears and desires our hopes and dreams intertwining like tendrils of smoke in the night sky it is here amidst the ebb and flow of consciousness that we confront the mysteries of existence and seek to unravel the enigma of our own existence in this liminal space where the boundaries between the seen and the unseen blur we are confronted with the myriad facets of reality the shadows that lurk in the depths of our subconscious the whispers of forgotten memories that echo through the corridors of our minds here in the twilight realm of dreams and nightmares we confront our innermost demons and embrace the darkness that lies within us all but amidst the chaos and confusion there is also beauty and wonder to be found a glimmer of hope that pierces the darkness like a beacon of light in the night sky it is in the simple moments of connection and compassion that we find solace amidst the storm reaching out to one another across the vast expanse of space and time to offer comfort and support and so as we navigate the turbulent waters of existence let us remember that we are not alone that we are all connected by the invisible threads of fate bound together in the eternal tapestry of life and as we stand at the precipice of the unknown let us embrace the journey that lies ahead for it is only through facing our fears and embracing the unknown that we can truly discover the beauty and wonder of existence"
  
    const words = content.split(" ")
    const para = []

    for (let i = 0; i < 100; i++) {
      para.push(words[Math.floor(Math.random() * words.length)])
    }
    return para.join(" ")
  }

  const funcKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key
    const currentCharacter = text[typed.length]
    console.log(key, currentCharacter);
    

    if (key === 'Backspace') {
      setTyped(typed.slice(0, -1))
    } else if (key.length === 1) {
      setTyped(typed + key)
    }
  }

  const [text, setText] = useState('')
  const [typed, setTyped] = useState('')
  const [font, setFont] = useState('sans')
  const [timer, setTimer] = useState(15)
  const [background, setBackground] = useState('gray')

  useEffect(() => {
    setText(generateParagraphs())
  }, [])

  const handleFontChange = (e: any) => {
    setFont(e.target.value)
  }

  const handleBackgroundChange = (e: any) => {
    setBackground(e.target.value)
  }

  return (
    <div className={(background === 'gray' ? 'text-white' : 'text-black') + ` text-xs font-${font.toLowerCase()} `}>
      <div className='flex gap-12 m-8'>
        <ul className='flex gap-4'>
          <li className='border px-3 py-1 rounded-md'>Punctuations</li>
          <li className='border px-3 py-1 rounded-md'>Numbers</li>
        </ul>
        <div className=''>
          <ul className='flex gap-4'>
            <li onClick={() => setTimer(15)} className='font border px-4 py-1 rounded-md'>15</li>
            <li onClick={() => setTimer(30)} className='border px-3 py-1 rounded-md'>30</li>
            <li onClick={() => setTimer(60)} className='border px-3 py-1 rounded-md'>60</li>
            <li onClick={() => setTimer(120)} className='border px-3 py-1 rounded-md'>120</li>
          </ul>
        </div>

        <div className='flex gap-2 items-center align-middle'>
          <p className='text-base'>Font:</p>
          <select
            className='border'
            name="Font"
            id="font"
            value={font}
            onChange={handleFontChange}
          >
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="mono">Mono</option>
          </select>
        </div>

        <div className='flex gap-2 items-center align-middle'>
          <p className='text-base'>Background:</p>
          <select className='border' name="Background" id="background" value={background} onChange={handleBackgroundChange}>
            <option value="gray">Gray</option>
            <option value="white">White</option>
          </select>
        </div>
      </div>

      <div 
        onKeyDown={funcKey} 
        tabIndex={0} 
        className='border-2 relative m-8 h-[6rem] overflow-hidden focus:outline-none'
      >
        <div className='leading-[2rem] text-2xl'>
          {text.split('').map((char, index) => {
            let className = ''
            if (index < typed.length) {
              className = typed[index] === char ? 'text-green-500' : 'text-red-500'
            }
            return <span key={index} className={className}>{char}</span>
          })}
          </div>
        <div className={`h-[1.5rem] top-1 animate-blink w-0.5 absolute bg-red-400`}></div>
      </div>
    </div>
  )
}

export default Page
