import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CartView from '@/views/CartView.vue'
import { createTestingPinia } from '@pinia/testing'
vi.mock('@/utils/order.js', () => ({
    default: vi.fn(),
}));
import sendOrder from '@/utils/order.js';

const fakeCartItems = [
    { id: 'p1', name: '紅茶拿鐵', price: 120, quantity: 1, imageUrl: '', receiverId: 101 },
    { id: 'p2', name: '抹茶蛋糕', price: 150, quantity: 2, imageUrl: '', receiverId: 101 },
]

describe('CartView.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(CartView, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        initialState: {
                            cart: {
                                cartItems: fakeCartItems,
                            },
                        },
                    }),
                ],
            },
        })
    })

    it('應顯示正確的商品名稱與數量', () => {
        const productTitles = wrapper.findAll('[data-test="product-name"]')
        expect(productTitles).toHaveLength(2)
        expect(productTitles[0].text()).toContain('紅茶拿鐵')
        expect(productTitles[1].text()).toContain('抹茶蛋糕')
    })

    it('應正確顯示總金額', () => {
        const total = wrapper.find('[data-test="cart-total"]')
        expect(total.text()).toContain('420')
    })

    it('點擊刪除應觸發 removeFromCart 方法', async () => {
        const removeButtons = wrapper.findAll('[data-test="remove-button"]')
        await removeButtons[0].trigger('click')

        const cartStore = wrapper.vm.cartStore
        expect(cartStore.removeFromCart).toHaveBeenCalledWith('p1')
    })
    it('提交 LINEPAY 訂單時會呼叫 sendOrder()', async () => {
        sendOrder.mockResolvedValue({ success: true })

        wrapper.vm.formData.receiverId = '123'
        wrapper.vm.formData.message = '生日快樂'
        wrapper.vm.formData.paymentMethod = 'LINEPAY'
        wrapper.vm.step = 3

        await wrapper.vm.$nextTick()

        const form = wrapper.find('[data-test="submit-order"]')
        await form.trigger('submit')

        expect(sendOrder).toHaveBeenCalledWith('123', '生日快樂')
    })
})
