export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: '24px',
      }}
    >
      <img
        src="/superhero-hq-team-emblem.png"
        alt="Superhero HQ"
        style={{
          width: '220px',
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
