import Vue from 'vue';
import { formatPrice } from '@/common/utils';

Vue.filter('formatPrice', formatPrice);