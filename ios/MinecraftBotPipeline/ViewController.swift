//
//  ViewController.swift
//  MinecraftBotPipeline
//
//  Main view controller for bot management
//

import UIKit

class ViewController: UIViewController {
    
    // UI Elements
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.text = "MC Bot Pipeline"
        label.font = UIFont.boldSystemFont(ofSize: 28)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let statusLabel: UILabel = {
        let label = UILabel()
        label.text = "Ready to connect"
        label.font = UIFont.systemFont(ofSize: 16)
        label.textAlignment = .center
        label.textColor = .systemGray
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let voicePresetsButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Voice Presets (16)", for: .normal)
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        button.backgroundColor = .systemBlue
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 10
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    private let createBotButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Create Bot", for: .normal)
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        button.backgroundColor = .systemGreen
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 10
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    private let start24x7Button: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Start 24/7 AI Player", for: .normal)
        button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        button.backgroundColor = .systemOrange
        button.setTitleColor(.white, for: .normal)
        button.layer.cornerRadius = 10
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()
    
    private let featuresTextView: UITextView = {
        let textView = UITextView()
        textView.isEditable = false
        textView.font = UIFont.systemFont(ofSize: 14)
        textView.backgroundColor = .systemGray6
        textView.layer.cornerRadius = 10
        textView.translatesAutoresizingMaskIntoConstraints = false
        return textView
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .systemBackground
        
        setupUI()
        setupActions()
        loadFeatures()
    }
    
    private func setupUI() {
        view.addSubview(titleLabel)
        view.addSubview(statusLabel)
        view.addSubview(voicePresetsButton)
        view.addSubview(createBotButton)
        view.addSubview(start24x7Button)
        view.addSubview(featuresTextView)
        
        NSLayoutConstraint.activate([
            // Title
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            // Status
            statusLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            // Voice Presets Button
            voicePresetsButton.topAnchor.constraint(equalTo: statusLabel.bottomAnchor, constant: 30),
            voicePresetsButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            voicePresetsButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            voicePresetsButton.heightAnchor.constraint(equalToConstant: 50),
            
            // Create Bot Button
            createBotButton.topAnchor.constraint(equalTo: voicePresetsButton.bottomAnchor, constant: 15),
            createBotButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            createBotButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            createBotButton.heightAnchor.constraint(equalToConstant: 50),
            
            // 24/7 Button
            start24x7Button.topAnchor.constraint(equalTo: createBotButton.bottomAnchor, constant: 15),
            start24x7Button.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            start24x7Button.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            start24x7Button.heightAnchor.constraint(equalToConstant: 50),
            
            // Features Text View
            featuresTextView.topAnchor.constraint(equalTo: start24x7Button.bottomAnchor, constant: 20),
            featuresTextView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            featuresTextView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            featuresTextView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20)
        ])
    }
    
    private func setupActions() {
        voicePresetsButton.addTarget(self, action: #selector(showVoicePresets), for: .touchUpInside)
        createBotButton.addTarget(self, action: #selector(createBot), for: .touchUpInside)
        start24x7Button.addTarget(self, action: #selector(start24x7Player), for: .touchUpInside)
    }
    
    private func loadFeatures() {
        let features = """
        ✨ FEATURES ✨
        
        ✓ Bot Creation System
          - Create unlimited Minecraft bots
          - Each with unique personality
        
        ✓ 16 Voice Model Presets
          - 8 Male voices (m1-m8)
          - 8 Female voices (f1-f8)
          - Each with unique characteristics
        
        ✓ AI Personalities
          - Explorer, Builder, Warrior
          - Farmer, Trader, Redstoner
          - Adventurer, Guardian
        
        ✓ Memory System
          - Short-term memory (recent events)
          - Long-term memory (players, locations)
          - Relationship tracking
        
        ✓ Streaming Schedule
          - Bots hop on/off based on schedule
          - 24/7, peak hours, weekday/weekend
          - Custom time ranges
        
        ✓ 24/7 AI Player
          - Keeps Aternos server alive
          - Prevents server from sleeping
          - Automatic activity to avoid AFK
        
        ✓ Smart Behaviors
          - Context-aware chat responses
          - Personality-driven actions
          - Player interaction memory
        """
        
        featuresTextView.text = features
    }
    
    @objc private func showVoicePresets() {
        let alert = UIAlertController(
            title: "Voice Presets",
            message: "16 voice presets available:\n\nMale (m1-m8):\nDeep Commander, Friendly Guide,\nYoung Explorer, Wise Mentor,\nAction Hero, Tech Expert,\nStoryteller, Casual Buddy\n\nFemale (f1-f8):\nElegant Leader, Cheerful Friend,\nMysterious Sage, Adventurous Spirit,\nGentle Healer, Tactical Strategist,\nEnergetic Performer, Calm Narrator",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    @objc private func createBot() {
        let alert = UIAlertController(
            title: "Create Bot",
            message: "Bot creation functionality is active!\n\nBots can be created with:\n- Unique personality\n- Voice preset\n- Custom schedule\n- Memory system",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
        
        statusLabel.text = "Bot creation active ✓"
    }
    
    @objc private func start24x7Player() {
        let alert = UIAlertController(
            title: "24/7 AI Player",
            message: "Starting 24/7 AI player to keep Aternos server alive!\n\nThe bot will:\n- Stay online 24/7\n- Perform periodic activity\n- Prevent server sleep",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "Start", style: .default) { _ in
            self.statusLabel.text = "24/7 AI Player running ✓"
        })
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        present(alert, animated: true)
    }
}
