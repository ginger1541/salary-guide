<!-- src/components/common/HelpTooltip.vue -->
<template>
  <div class="help-tooltip">
    <!-- 트리거 요소 (슬롯) -->
    <div 
      ref="trigger"
      class="help-trigger"
      @click="toggle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot name="trigger">
        <button type="button" class="btn btn-sm btn-link p-0">
          <i class="bi bi-question-circle"></i>
        </button>
      </slot>
    </div>
    
    <!-- 툴팁 콘텐츠 -->
    
      
        <div
          v-if="isVisible"
          ref="tooltip"
          class="help-tooltip-content"
          :class="[
            `tooltip-${computedPlacement}`,
            { 'tooltip-large': large }
          ]"
          :style="tooltipStyle"
          @mouseenter="handleTooltipMouseEnter"
          @mouseleave="handleTooltipMouseLeave"
        >
          <!-- 화살표 -->
          <div class="tooltip-arrow" :style="arrowStyle"></div>
          
          <!-- 콘텐츠 -->
          <div class="tooltip-inner">
            <!-- 헤더 (옵션) -->
            <div v-if="title" class="tooltip-header">
              <h6 class="mb-0">
                <i v-if="icon" :class="icon" class="me-2"></i>
                {{ title }}
              </h6>
              <button 
                v-if="showClose && trigger === 'click'"
                type="button" 
                class="btn-close btn-close-white btn-sm"
                @click="hide"
              ></button>
            </div>
            
            <!-- 바디 -->
            <div class="tooltip-body">
              <slot>
                <p v-if="content" class="mb-0" v-html="content"></p>
              </slot>
              
              <!-- 추가 정보 -->
              <div v-if="details" class="tooltip-details">
                <div v-for="(detail, index) in details" :key="index" class="detail-item">
                  <small class="text-muted">{{ detail.label }}</small>
                  <p class="mb-0 fw-bold">{{ detail.value }}</p>
                </div>
              </div>
              
              <!-- 링크 -->
              <div v-if="link" class="tooltip-footer">
                <a 
                  :href="link.url" 
                  target="_blank" 
                  class="btn btn-sm btn-primary"
                >
                  {{ link.text }}
                  <i class="bi bi-box-arrow-up-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      

  </div>
</template>

<script>
import { nextTick } from 'vue'

export default {
  name: 'HelpTooltip',
  
  props: {
    // 콘텐츠
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    details: {
      type: Array,
      default: () => []
    },
    link: {
      type: Object,
      default: null
    },
    
    // 동작 옵션
    trigger: {
      type: String,
      default: 'hover',
      validator: (value) => ['hover', 'click', 'manual'].includes(value)
    },
    placement: {
      type: String,
      default: 'top',
      validator: (value) => ['top', 'bottom', 'left', 'right', 'auto'].includes(value)
    },
    delay: {
      type: Number,
      default: 200
    },
    
    // 스타일 옵션
    large: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: String,
      default: '300px'
    }
  },
  
  emits: ['show', 'hide'],
  
  data() {
    return {
      isVisible: false,
      tooltipStyle: {},
      arrowStyle: {},
      computedPlacement: this.placement,
      showTimeout: null,
      hideTimeout: null,
      isHoveringTooltip: false
    }
  },
  
  watch: {
    isVisible(newVal) {
      if (newVal) {
        nextTick(() => {
          this.updatePosition()
        })
      }
    }
  },
  
  mounted() {
    // 클릭 외부 영역 감지
    if (this.trigger === 'click') {
      document.addEventListener('click', this.handleClickOutside)
    }
    
    // 스크롤 시 위치 업데이트
    window.addEventListener('scroll', this.updatePosition)
    window.addEventListener('resize', this.updatePosition)
  },
  
  beforeUnmount() {
    if (this.trigger === 'click') {
      document.removeEventListener('click', this.handleClickOutside)
    }
    
    window.removeEventListener('scroll', this.updatePosition)
    window.removeEventListener('resize', this.updatePosition)
    
    this.clearTimeouts()
  },
  
  methods: {
    show() {
      this.clearTimeouts()
      this.isVisible = true
      this.$emit('show')
    },
    
    hide() {
      this.clearTimeouts()
      this.isVisible = false
      this.$emit('hide')
    },
    
    toggle() {
      if (this.trigger === 'click') {
        this.isVisible ? this.hide() : this.show()
      }
    },
    
    handleMouseEnter() {
      if (this.trigger === 'hover') {
        this.clearTimeouts()
        this.showTimeout = setTimeout(() => {
          this.show()
        }, this.delay)
      }
    },
    
    handleMouseLeave() {
      if (this.trigger === 'hover') {
        this.clearTimeouts()
        this.hideTimeout = setTimeout(() => {
          if (!this.isHoveringTooltip) {
            this.hide()
          }
        }, 100)
      }
    },
    
    handleTooltipMouseEnter() {
      this.isHoveringTooltip = true
      this.clearTimeouts()
    },
    
    handleTooltipMouseLeave() {
      this.isHoveringTooltip = false
      if (this.trigger === 'hover') {
        this.hideTimeout = setTimeout(() => {
          this.hide()
        }, 100)
      }
    },
    
    handleClickOutside(event) {
      if (!this.$el.contains(event.target) && 
          !this.$refs.tooltip?.contains(event.target)) {
        this.hide()
      }
    },
    
    clearTimeouts() {
      if (this.showTimeout) {
        clearTimeout(this.showTimeout)
        this.showTimeout = null
      }
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout)
        this.hideTimeout = null
      }
    },
    
    updatePosition() {
      if (!this.isVisible || !this.$refs.trigger || !this.$refs.tooltip) {
        return
      }
      
      const trigger = this.$refs.trigger.getBoundingClientRect()
      const tooltip = this.$refs.tooltip.getBoundingClientRect()
      const spacing = 8
      
      let placement = this.placement
      let top = 0
      let left = 0
      
      // Auto placement
      if (placement === 'auto') {
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        
        if (trigger.top > viewportHeight / 2) {
          placement = 'top'
        } else {
          placement = 'bottom'
        }
      }
      
      // 위치 계산
      switch (placement) {
        case 'top':
          top = trigger.top - tooltip.height - spacing
          left = trigger.left + (trigger.width - tooltip.width) / 2
          break
        case 'bottom':
          top = trigger.bottom + spacing
          left = trigger.left + (trigger.width - tooltip.width) / 2
          break
        case 'left':
          top = trigger.top + (trigger.height - tooltip.height) / 2
          left = trigger.left - tooltip.width - spacing
          break
        case 'right':
          top = trigger.top + (trigger.height - tooltip.height) / 2
          left = trigger.right + spacing
          break
      }
      
      // 화면 밖으로 나가지 않도록 조정
      const margin = 10
      if (left < margin) left = margin
      if (left + tooltip.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltip.width - margin
      }
      if (top < margin) top = margin
      if (top + tooltip.height > window.innerHeight - margin) {
        top = window.innerHeight - tooltip.height - margin
      }
      
      this.tooltipStyle = {
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
        maxWidth: this.maxWidth
      }
      
      this.computedPlacement = placement
      
      // 화살표 위치
      const arrowLeft = trigger.left + trigger.width / 2 - left
      this.arrowStyle = {
        left: `${arrowLeft}px`
      }
    }
  }
}
</script>

<style scoped>
.help-trigger {
  display: inline-block;
  cursor: pointer;
}

.help-tooltip-content {
  position: relative;
  z-index: 0;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
}

.tooltip-inner {
  background: #212529;
  color: white;
  border-radius: 0.375rem;
  overflow: hidden;
}

.tooltip-large .tooltip-inner {
  min-width: 400px;
}

/* 화살표 */
.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.tooltip-top .tooltip-arrow {
  bottom: -6px;
  border-width: 6px 6px 0;
  border-color: #212529 transparent transparent;
}

.tooltip-bottom .tooltip-arrow {
  top: -6px;
  border-width: 0 6px 6px;
  border-color: transparent transparent #212529;
}

.tooltip-left .tooltip-arrow {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 0 6px 6px;
  border-color: transparent transparent transparent #212529;
}

.tooltip-right .tooltip-arrow {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-color: transparent #212529 transparent transparent;
}

/* 헤더 */
.tooltip-header {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip-header h6 {
  font-size: 0.875rem;
  font-weight: 600;
}

/* 바디 */
.tooltip-body {
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.tooltip-details {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.detail-item {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
}

.detail-item small {
  font-size: 0.75rem;
  opacity: 0.8;
}

.detail-item p {
  font-size: 0.875rem;
}

/* 푸터 */
.tooltip-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-footer .btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
}

/* 애니메이션 */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 반응형 */
@media (max-width: 576px) {
  .tooltip-large .tooltip-inner {
    min-width: 300px;
  }
  
  .help-tooltip-content {
    max-width: calc(100vw - 20px) !important;
  }
}
</style>