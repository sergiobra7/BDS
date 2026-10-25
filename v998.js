/* BIR.DUVARSESI V9.9.8 — final static editorial posture guard. */
(function(){
'use strict';
const oldPrompt=prompt;
prompt=function(){
 const p=oldPrompt.apply(this,arguments);
 return p+'\n\n=== V9.9.8 STATIC EDITORIAL POSE AUTHORITY ===\n'+
 'Every visible figure must be captured in a fully stationary, physically supported pose. Allowed: standing still, sitting, leaning, crouching still, resting arms, holding a cup or poster, fixed gestures and fixed head/neck gaze. Standing is NOT mandatory.\n'+
 'FORBIDDEN: walking, strolling, jogging, running, stepping, striding, jumping, parachuting, sitting down, standing up, entering, exiting, stopping mid-walk, motion blur, wind-driven action, or any pose that implies movement.\n'+
 'If a legacy saved pose or automatically proposed action describes movement, interpret it as a stationary end-state while preserving the person, clothing, props, scene, placement and meaningful gesture. Do not delete or overwrite saved user selections. Keep the first-line gaze geometry lock active.\n'+
 '=== END STATIC EDITORIAL POSE AUTHORITY ===\n';
};
})();
