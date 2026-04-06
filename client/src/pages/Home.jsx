// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { Button } from '../components/Ui/Button.jsx';
import { Card } from '../components/Ui/Card.jsx';
import { Footer } from '../components/Layout/Footer.jsx';

export const Home = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute w-[480px] h-[480px] bg-gold-400 opacity-9 rounded-full -top-30 -right-30" />
        <div className="absolute w-[300px] h-[300px] bg-coral-500 opacity-7 rounded-full bottom-15 -left-20" />
        <div className="absolute w-[180px] h-[180px] bg-sage-500 opacity-9 rounded-full top-40% right-18%" />
        
        {/* Floating emojis */}
        {['🌟', '💛', '✨', '🎉', '💌'].map((emoji, i) => (
          <div 
            key={i}
            className="absolute animate-float"
            style={{
              fontSize: ['36px', '30px', '26px', '28px', '34px'][i],
              top: ['120px', '180px', '160px', '55%', '200px'][i],
              left: ['40px', undefined, '25%', '38%', undefined][i],
              right: [undefined, '80px', undefined, undefined, '60px'][i],
              bottom: [undefined, undefined, undefined, undefined, undefined][i],
              animationDelay: `${i * 0.7}s`
            }}
          >
            {emoji}
          </div>
        ))}
        
        <div className="max-w-6xl mx-auto px-5 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold-300/45 border border-gold-400/40 text-ink-700 text-xs font-medium px-4 py-1.75 rounded-full mb-7 animate-fade-in">
                <span>✨</span> Anonymous compliments, zero awkwardness
              </div>
              
              <h1 className="font-display text-[clamp(42px,5vw,70px)] font-bold text-ink-900 leading-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                Let the world<br />
                <em className="text-gold-500 not-italic">shower you</em><br />
                with love.
              </h1>
              
              <p className="text-lg text-ink-600 leading-relaxed max-w-md mb-9 animate-slide-up" style={{ animationDelay: '200ms' }}>
                Create your personal kudos board. Share the link. Watch the warm fuzzies roll in — anonymously, beautifully.
              </p>
              
              <div className="flex gap-3.5 flex-wrap animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Link to="/register">
                  <Button variant="primary" size="xl">Create my board →</Button>
                </Link>
                <Link to="/board">
                  <Button variant="secondary" size="xl">See a demo board</Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 mt-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="flex">
                  {['#FF6B55', '#74AB80', '#9B82C8', '#E6B020'].map((color, i) => (
                    <div 
                      key={i}
                      className="w-8.5 h-8.5 rounded-full border-2 border-cream-50 flex items-center justify-center text-white text-xs font-bold -mr-2 last:mr-0"
                      style={{ backgroundColor: color }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-400">
                  <span className="font-semibold text-ink-900">2,400+</span> boards created this week
                </p>
              </div>
            </div>
            
            {/* Floating cards preview */}
            <div className="relative h-[520px] hidden lg:block">
              {[
                { emoji: '🌻', text: '"You have this magical ability to make every room brighter just by walking in. Never change!"', author: 'A secret admirer ✦', top: 0, right: '16px', width: '280px' },
                { emoji: '💫', text: '"Your code reviews are the best — harsh but so, so helpful."', author: 'Anonymous', top: '150px', left: 0, width: '255px', bg: 'bg-gold-300/60 border-gold-400/35' },
                { emoji: '🎉', text: '"You turned a terrible Monday into something I actually look forward to. Thank you!"', author: 'A grateful friend', bottom: '130px', right: '20px', width: '270px' },
                { emoji: '🌙', text: '"You\'re genuinely one of the kindest people I\'ve ever met."', author: '📌 Pinned favorite', bottom: '10px', left: '10px', width: '240px', bg: 'bg-ink-900 text-cream-200', authorClass: 'text-gold-400' },
              ].map((card, i) => (
                <Card 
                  key={i}
                  className={`absolute p-5 animate-slide-up ${card.bg || ''}`}
                  style={{ 
                    top: card.top, 
                    right: card.right, 
                    left: card.left, 
                    bottom: card.bottom, 
                    width: card.width,
                    animationDelay: `${(i + 2) * 150}ms`
                  }}
                  hover={true}
                >
                  <div className="flex gap-3">
                    <span className="text-2xl">{card.emoji}</span>
                    <div>
                      <p className="text-sm text-ink-800 leading-relaxed">{card.text}</p>
                      <p className={`text-[11px] mt-2 font-mono ${card.authorClass || 'text-ink-400'}`}>
                        — {card.author}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="bg-ink-900 py-24 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-gold-400 opacity-5 rounded-full -top-25 -right-25" />
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="font-mono text-gold-400 text-xs tracking-widest uppercase mb-3">How it works</p>
            <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold text-cream-50">Three steps to joy.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📋', title: 'Create your board', desc: 'Sign up, pick your username, and get your link instantly — like kudos.app/u/alex' },
              { icon: '📤', title: 'Share your link', desc: 'Drop it in your bio, Slack status, email signature — anywhere friends can find it.' },
              { icon: '💌', title: 'Receive the love', desc: 'Anyone can post — no login needed. You pin favorites and hide what doesn\'t fit.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border ${
                  i === 0 ? 'bg-gold-400/15 border-gold-400/25' :
                  i === 1 ? 'bg-sage-500/15 border-sage-500/25' :
                  'bg-coral-500/15 border-coral-500/25'
                }`}>
                  {step.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-cream-100 mb-2.5">{step.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="font-mono text-ink-400 text-xs tracking-widest uppercase mb-3">Features</p>
            <h2 className="font-display text-[clamp(30px,4vw,44px)] font-bold text-ink-900">Built for good vibes only.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '🎭', title: 'Truly Anonymous', desc: 'No accounts for senders. Posts freely, receives openly. No awkwardness, ever.', bg: 'bg-gold-300/30 border-gold-400/30' },
              { icon: '📌', title: 'Pin Your Favorites', desc: 'Curate your board. Showcase the kudos that mean the most at the top.', bg: 'bg-white border-cream-200' },
              { icon: '🛡️', title: 'You\'re in Control', desc: 'Hide or delete anything that feels off. Moderate with one click.', bg: 'bg-ink-900', text: 'text-cream-50', descText: 'text-ink-600' },
              { icon: '🎨', title: 'Emoji Expression', desc: 'Senders choose an emoji to set the mood of their message.', bg: 'bg-white border-cream-200' },
              { icon: '⚡', title: 'Instant Delivery', desc: 'Kudos appear on your board the moment they\'re sent, no delays.', bg: 'bg-sage-400/20 border-sage-500/30' },
              { icon: '🔗', title: 'Beautiful Profile', desc: 'Your public page is gorgeous and shareable anywhere.', bg: 'bg-white border-cream-200' },
            ].map((feature, i) => (
              <Card key={i} className={`p-6 ${feature.bg}`} hover={true}>
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className={`font-display text-base font-semibold mb-2 ${feature.text || 'text-ink-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feature.descText || 'text-ink-600'}`}>
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-gold-300/25 border-t border-gold-400/20 py-24">
        <div className="max-w-lg mx-auto px-5 text-center">
          <div className="text-4xl mb-5 animate-float">🌟</div>
          <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold text-ink-900 mb-4">
            Ready to feel good?
          </h2>
          <p className="text-lg text-ink-600 leading-relaxed mb-9">
            Your board takes 30 seconds to set up. Start collecting warm fuzzies today.
          </p>
          <Link to="/register">
            <Button variant="primary" size="xl">Create your free board</Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};