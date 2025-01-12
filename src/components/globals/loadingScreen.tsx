export default function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="flex flex-col items-center gap-4">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-lg text-muted-foreground">Loading task details...</p>
      </div>
    </div>
  );
}
