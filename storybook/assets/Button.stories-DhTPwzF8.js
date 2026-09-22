import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DRjtymdW.js";import{n,t as r}from"./Button-Cpx9pasB.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a={title:`Atoms/Button`,component:r,argTypes:{variant:{control:`inline-radio`,options:[`black`,`white`,`bordered`]}},args:{children:`More details`,variant:`black`}},o={},s={args:{variant:`bordered`}},c={args:{variant:`white`,children:`Send`},decorators:[e=>(0,i.jsx)(`div`,{style:{background:`#000`,padding:40},children:(0,i.jsx)(e,{})})]},l={args:{href:`#`,children:`Read`}},u={args:{href:`#`,overlayLink:!0,variant:`white`,children:`Read`},decorators:[e=>(0,i.jsx)(`div`,{style:{background:`#000`,padding:40},children:(0,i.jsx)(e,{})})]},d={args:{disabled:!0}},f={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{variant:`black`,children:`Black`}),(0,i.jsx)(r,{variant:`bordered`,children:`Bordered`}),(0,i.jsx)(r,{variant:`black`,disabled:!0,children:`Disabled`})]})},p=[`Black`,`Bordered`,`White`,`AsLink`,`OverlayLink`,`Disabled`,`AllVariants`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'bordered'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'white',
    children: 'Send'
  },
  // \`btn--white\` is only used on the dark footer and inside the modal.
  decorators: [Story => <div style={{
    background: '#000',
    padding: 40
  }}>
        <Story />
      </div>]
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    href: '#',
    children: 'Read'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    href: '#',
    overlayLink: true,
    variant: 'white',
    children: 'Read'
  },
  decorators: [Story => <div style={{
    background: '#000',
    padding: 40
  }}>
        <Story />
      </div>]
}`,...u.parameters?.docs?.source},description:{story:`Some of the site's blocks style \`.btn a\` as a full-size overlay — the stories
slider does. There the label has to sit outside the anchor, or it would be
lifted out of flow with it.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      <Button variant="black">Black</Button>
      <Button variant="bordered">Bordered</Button>
      <Button variant="black" disabled>
        Disabled
      </Button>
    </div>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as AllVariants,l as AsLink,o as Black,s as Bordered,d as Disabled,u as OverlayLink,c as White,p as __namedExportsOrder,a as default};