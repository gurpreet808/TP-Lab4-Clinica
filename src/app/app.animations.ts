import {
    trigger,
    transition,
    style,
    animate,
    query,
    group,
    animateChild
  } from '@angular/animations';
  
  export const routerTransition = trigger('routeAnimations', [
    
    // --- ANIMACIÓN slideInLeft ---
    transition('* => slideInLeft', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),
  
    // --- ANIMACIÓN fadeInLeft ---
    transition('* => fadeInLeft', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),
  
    // --- ANIMACIÓN zoomInLeft ---
    transition('* => zoomInLeft', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'scale3d(.1, .1, .1) translate3d(-1000px, 0, 0)' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('150ms ease-out', style({ transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' })),
          animate('600ms ease-out', style({ opacity: 1, transform: 'scale3d(.475, .475, .475) translate3d(10px, 0, 0)' }))
        ], { optional: true }),
        query(':enter', [
          animate('600ms ease-out', style({ opacity: 1, transform: 'scale3d(.475, .475, .475) translate3d(10px, 0, 0)' })),
          animate('150ms ease-out', style({ transform: 'scale3d(1, 1, 1) translate3d(0, 0, 0)' }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),
  
    // --- ANIMACIÓN rotateInDownLeft ---
    transition('* => rotateInDownLeft', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transformOrigin: 'left bottom', transform: 'rotate3d(0, 0, 1, -45deg)' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 1, transformOrigin: 'left bottom', transform: 'rotate3d(0, 0, 1, 0deg)' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transformOrigin: 'left bottom', transform: 'rotate3d(0, 0, 1, 0deg)' }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ]),
  
    // --- ANIMACIÓN rollIn ---
    transition('* => rollIn', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg)' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0deg)' }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ])
  ]);