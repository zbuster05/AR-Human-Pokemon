//
//  ContentView.swift
//  HuxArTest
//
//  Created by Oscar Capraro on 3/17/20.
//  Copyright © 2020 Oscar Capraro. All rights reserved.
//

import SwiftUI
import RealityKit

struct ContentView : View {
    var body: some View {
        return ARViewContainer().edgesIgnoringSafeArea(.all)
    }
}

struct ARViewContainer: UIViewRepresentable {
    
    func makeUIView(context: Context) -> ARView {
        
        let arView = ARView(frame: .zero)
        
        // Load the "Box" scene from the "Experience" Reality File
        let boxAnchor = try! HuxleyAr.loadHuxleyAdventure()
        
        
        // Add the box anchor to the scene
        arView.scene.anchors.append(boxAnchor)
        
        //boxAnchor.location1?.removeFromParent()
        
        //boxAnchor.actions.frontLeftBoxTapped.onAction = handleTapOnEntity(_:)
        boxAnchor.actions.launched.onAction = handleTapOnEntity(_:)
                
        return arView
        
    }
    
    func updateUIView(_ uiView: ARView, context: Context) {}
    
    func handleTapOnEntity(_ entity: Entity?) {
        guard let entity = entity else { return }
        // Do something with entity...
        print(entity.name)
        
        let huxBot = entity.scene?.findEntity(named: "HuxleyBot")
        
        print(huxBot?.name)
        
        
        huxBot?.move(to: entity.transformMatrix(relativeTo: huxBot), relativeTo: nil, duration: 1)
        

    }
    
}

#if DEBUG
struct ContentView_Previews : PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
#endif
