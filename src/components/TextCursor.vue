<!-- <template>
  <div 
    ref="containerRef" 
    class="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50"
  >
    <div class="absolute inset-0 pointer-events-none">
      <TransitionGroup name="trail">
        <div
          v-for="item in trail"
          :key="item.id"
          :data-trail-id="item.id"
          class="absolute select-none whitespace-nowrap text-3xl"
          :style="getItemStyle(item)"
        >
          {{ text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';

interface TextCursorProps {
  text?: string;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
}

const props = withDefaults(defineProps<TextCursorProps>(), {
  text: '⚛️',
  spacing: 50,
  followMouseDirection: true,
  randomFloat: true,
  exitDuration: 1,
  removalInterval: 50,
  maxPoints: 10
});

const containerRef = ref<HTMLDivElement>(null);
const trail = ref<TrailItem[]>([]);
const lastMoveTimeRef = ref<number>(Date.now());
const idCounter = ref<number>(0);

const getItemStyle = (item: TrailItem) => ({
  left: `${item.x}px`,
  top: `${item.y}px`,
  transform: `rotate(${item.angle}deg)`
});

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const newTrail = [...trail.value];
  if (newTrail.length === 0) {
    newTrail.push({
      id: idCounter.value++,
      x: mouseX,
      y: mouseY,
      angle: 0,
      ...(props.randomFloat && {
        randomX: Math.random() * 10 - 5,
        randomY: Math.random() * 10 - 5,
        randomRotate: Math.random() * 10 - 5
      })
    });
  } else {
    const last = newTrail[newTrail.length - 1];
    const dx = mouseX - last.x;
    const dy = mouseY - last.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance >= props.spacing) {
      let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      rawAngle = ((rawAngle + 180) % 360) - 180;

      const computedAngle = props.followMouseDirection ? rawAngle : 0;
      const steps = Math.floor(distance / props.spacing);
      for (let i = 1; i <= steps; i++) {
        const t = (props.spacing * i) / distance;
        const newX = last.x + dx * t;
        const newY = last.y + dy * t;
        newTrail.push({
          id: idCounter.value++,
          x: newX,
          y: newY,
          angle: computedAngle,
          ...(props.randomFloat && {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5
          })
        });
      }
    }
  }
  if (newTrail.length > props.maxPoints) {
    newTrail.splice(0, newTrail.length - props.maxPoints);
  }
  trail.value = newTrail;
  lastMoveTimeRef.value = Date.now();

  // Animate trail items with GSAP
  newTrail.forEach((item) => {
    const element = document.querySelector(`[data-trail-id="${item.id}"]`) as HTMLElement;
    if (element && props.randomFloat) {
      gsap.to(element, {
        x: item.randomX || 0,
        y: item.randomY || 0,
        duration: 0.8,
        ease: 'sine.inOut',
        overwrite: 'auto'
      });
    }
  });
};

onMounted(() => {
  const container = containerRef.value;
  if (!container) return;

  document.addEventListener('mousemove', handleMouseMove);

  const interval = setInterval(() => {
    if (Date.now() - lastMoveTimeRef.value > 100) {
      if (trail.value.length > 0) {
        trail.value.shift();
      }
    }
  }, props.removalInterval);

  const cleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    clearInterval(interval);
    gsap.killTweensOf('[data-trail-id]');
  };

  return cleanup;
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  gsap.killTweensOf('[data-trail-id]');
});
</script>

<style scoped>
.trail-enter-active,
.trail-leave-active {
  transition: all 0.3s ease;
}

.trail-enter-from {
  opacity: 0;
  transform: scale(1);
}

.trail-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style> -->
