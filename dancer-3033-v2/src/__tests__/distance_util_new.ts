import DistanceUtilNew from "../helpers/distance_util_new"

describe('CalculateDistance', () => {
    it('should calculate distance between points', async () => {
      const response = DistanceUtilNew.calculateDistanceBetween(-25.76,27.53, -25.89,27.98)
      console.log(`💙 .... Distance Calculated: ${response} metres between points 💙`)
      expect(response).toBeGreaterThan(0)
      expect(response).toEqual(47356)
    })
  
})
  