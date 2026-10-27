
import type { GlobalConfig } from 'payload'

export const SiteDesign: GlobalConfig = {
  slug: 'site-design',

  label: 'Site Design',

  admin: {
    group: 'Site Settings',
  },
   
   
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'brandColors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          
          required: true,
          admin: {
            description: 'Primary navy brand color.',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          
          required: true,
          admin: {
            description: 'Secondary gold brand color.',
          },
        },
        {
          name: 'background',
          type: 'text',
          
          required: true,
        },
        {
          name: 'text',
          type: 'text',
          
          required: true,
        },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'headingFont',
          type: 'text',
        
        },
        {
          name: 'bodyFont',
          type: 'text',
          
        },
      ],
    },
    {
      name: 'appearance',
      type: 'group',
      fields: [
        {
          name: 'borderRadius',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
        {
          name: 'enableAnimations',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}



/////////////////////////
//////           ///////
////// ////////////////
///// ////////////////
//// ////////////////
////////////////////
///////////////////
//////////////////
/////////////////
////////////////
///////////////
//////////////
/////////////
////////////
///////////
//////////
/////////
////////
///////
//////
/////
////
///
//


